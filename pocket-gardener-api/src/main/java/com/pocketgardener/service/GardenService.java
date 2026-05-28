package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CreateLogRequest;
import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.dto.GardenDtos.CreateTaskRequest;
import com.pocketgardener.dto.GardenDtos.GardenSnapshot;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantRequest;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantResponse;
import com.pocketgardener.entity.*;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.*;
import com.pocketgardener.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class GardenService {
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final AtomicLong idCounter = new AtomicLong(System.currentTimeMillis());
    private final UserRepository userRepository;
    private final SpeciesRepository speciesRepository;
    private final PlantRepository plantRepository;
    private final CareLogRepository careLogRepository;
    private final CareTaskRepository careTaskRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final CommunityUserRepository communityUserRepository;
    private final FollowedUserRepository followedUserRepository;
    private final CommunityPostRepository communityPostRepository;
    private final AchievementRepository achievementRepository;
    private final CheckinDayRepository checkinDayRepository;
    private final PlantGrowthPointRepository plantGrowthPointRepository;
    private final QWeatherService qWeatherService;
    private final AiClientService aiClientService;

    public GardenService(UserRepository userRepository,
                         SpeciesRepository speciesRepository,
                         PlantRepository plantRepository,
                         CareLogRepository careLogRepository,
                         CareTaskRepository careTaskRepository,
                         AiSuggestionRepository aiSuggestionRepository,
                         WeatherAlertRepository weatherAlertRepository,
                         CommunityUserRepository communityUserRepository,
                         FollowedUserRepository followedUserRepository,
                         CommunityPostRepository communityPostRepository,
                         AchievementRepository achievementRepository,
                         CheckinDayRepository checkinDayRepository,
                         PlantGrowthPointRepository plantGrowthPointRepository,
                         QWeatherService qWeatherService,
                         AiClientService aiClientService) {
        this.userRepository = userRepository;
        this.speciesRepository = speciesRepository;
        this.plantRepository = plantRepository;
        this.careLogRepository = careLogRepository;
        this.careTaskRepository = careTaskRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.weatherAlertRepository = weatherAlertRepository;
        this.communityUserRepository = communityUserRepository;
        this.followedUserRepository = followedUserRepository;
        this.communityPostRepository = communityPostRepository;
        this.achievementRepository = achievementRepository;
        this.checkinDayRepository = checkinDayRepository;
        this.plantGrowthPointRepository = plantGrowthPointRepository;
        this.qWeatherService = qWeatherService;
        this.aiClientService = aiClientService;
    }

    @Transactional(readOnly = true)
    public GardenSnapshot snapshot() {
        User currentUser = userRepository.findById("u1").map(GardenMapper::toDto)
                .orElseThrow(() -> new IllegalStateException("缺少当前用户种子数据"));
        List<Plant> plants = plantRepository.findAll().stream().map(GardenMapper::toDto).toList();
        Map<String, PlantGrowthSeries> growthData = buildGrowthData();
        List<WeatherAlert> fallbackAlerts = weatherAlertRepository.findAll().stream().map(GardenMapper::toDto).toList();
        QWeatherService.QWeatherResult weather = qWeatherService.fetch(plants)
                .orElseGet(() -> new QWeatherService.QWeatherResult(
                        new CurrentWeather(currentUser.city(), "--", "暂无实时天气", "--", ""),
                        fallbackAlerts
                ));
        List<WeatherAlert> weatherAlerts = weather.alerts().isEmpty() ? fallbackAlerts : weather.alerts();

        return new GardenSnapshot(
                currentUser,
                speciesRepository.findAll().stream().map(GardenMapper::toDto).toList(),
                plants,
                careLogRepository.findAll().stream().sorted(Comparator.comparing(CareLogEntity::getTime).reversed()).map(GardenMapper::toDto).toList(),
                careTaskRepository.findAll().stream().map(GardenMapper::toDto).toList(),
                aiSuggestionRepository.findAll().stream().sorted(Comparator.comparing(AiSuggestionEntity::getTime).reversed()).map(GardenMapper::toDto).toList(),
                weather.currentWeather(),
                weatherAlerts,
                communityUserRepository.findAll().stream().map(GardenMapper::toDto).toList(),
                followedUserRepository.findAll().stream().map(FollowedUserEntity::getUserId).toList(),
                communityPostRepository.findAll().stream().sorted(Comparator.comparing(CommunityPostEntity::getTime).reversed()).map(GardenMapper::toDto).toList(),
                achievementRepository.findAll().stream().map(GardenMapper::toDto).toList(),
                growthData,
                checkinDayRepository.findAll().stream().map(CheckinDayEntity::getDay).sorted().toList()
        );
    }

    @Transactional
    public Plant createPlant(CreatePlantRequest request) {
        SpeciesEntity matched = speciesRepository.findByName(request.speciesName())
                .orElseGet(() -> speciesRepository.save(new SpeciesEntity(nextId("s"), request.speciesName(), "待补充", "观叶植物", 3, 14, "散射光")));
        PlantEntity plant = new PlantEntity(
                nextId("p"),
                request.nickname(),
                matched.getId(),
                LocalDate.now().toString(),
                LocalDate.now().toString(),
                blankToDefault(request.location(), "未设置"),
                "健康",
                request.tags() == null ? List.of() : request.tags(),
                ""
        );
        return GardenMapper.toDto(plantRepository.save(plant));
    }

    @Transactional
    public CareLog createLog(CreateLogRequest request) {
        requirePlant(request.plantId());
        CareLogEntity log = new CareLogEntity(
                nextId("l"),
                request.plantId(),
                request.type(),
                LocalDateTime.now().format(DATE_TIME),
                blankToDefault(request.note(), "无备注"),
                blankToDefault(request.status(), "正常")
        );
        String today = LocalDate.now().toString();
        if (!checkinDayRepository.existsById(today)) {
            checkinDayRepository.save(new CheckinDayEntity(today));
        }
        return GardenMapper.toDto(careLogRepository.save(log));
    }

    @Transactional
    public CareTask createTask(CreateTaskRequest request) {
        requirePlant(request.plantId());
        CareTaskEntity task = new CareTaskEntity(
                nextId("t"),
                request.plantId(),
                request.type(),
                request.planTime().replace('T', ' '),
                request.priority(),
                "待处理",
                "手动创建"
        );
        return GardenMapper.toDto(careTaskRepository.save(task));
    }

    @Transactional
    public CareTask updateTaskStatus(String taskId, String status) {
        CareTaskEntity task = careTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在: " + taskId));
        task.setStatus(status);
        return GardenMapper.toDto(careTaskRepository.save(task));
    }

    @Transactional
    public AiSuggestion generateSuggestion(String plantId) {
        PlantEntity plant = requirePlant(plantId);
        AiClientService.AiAdvice advice = aiClientService.generateCareAdvice(buildAiContext(plant))
                .orElseGet(() -> new AiClientService.AiAdvice(
                        "Local-Rule-Gardener",
                        plant.getNickname() + "近期养护建议",
                        "系统根据该植物的养护日志、任务状态和天气预警生成建议：保持当前浇水节奏，避免盆土长期积水，并观察叶片变化。"
                ));

        AiSuggestionEntity suggestion = new AiSuggestionEntity(
                nextId("a"),
                plantId,
                LocalDateTime.now().format(DATE_TIME),
                "健康".equals(plant.getStatus()) ? "低" : "中",
                advice.model(),
                advice.summary(),
                advice.detail()
        );
        return GardenMapper.toDto(aiSuggestionRepository.save(suggestion));
    }

    @Transactional(readOnly = true)
    public IdentifyPlantResponse identifyPlant(IdentifyPlantRequest request) {
        AiClientService.PlantIdentification identification = aiClientService.identifyPlant(request.imageDataUrl())
                .orElseThrow(() -> new IllegalArgumentException("植物识别失败，请换一张清晰图片后重试"));
        return new IdentifyPlantResponse(
                identification.speciesName(),
                identification.confidence(),
                identification.care()
        );
    }

    @Transactional
    public CommunityPost createPost(CreatePostRequest request) {
        UserEntity currentUser = userRepository.findById("u1")
                .orElseThrow(() -> new IllegalStateException("缺少当前用户种子数据"));
        CommunityPostEntity post = new CommunityPostEntity(
                nextId("c"),
                request.type(),
                currentUser.getId(),
                currentUser.getUsername(),
                request.title(),
                request.content(),
                LocalDate.now().toString(),
                0,
                0,
                request.tags() == null ? List.of() : request.tags(),
                "求助".equals(request.type()) ? "中" : null,
                List.of()
        );
        return GardenMapper.toDto(communityPostRepository.save(post));
    }

    @Transactional
    public List<String> toggleFollow(String userId) {
        if (followedUserRepository.existsById(userId)) {
            followedUserRepository.deleteById(userId);
        } else {
            followedUserRepository.save(new FollowedUserEntity(userId));
        }
        return followedUserRepository.findAll().stream().map(FollowedUserEntity::getUserId).toList();
    }

    private String buildAiContext(PlantEntity plant) {
        SpeciesEntity species = speciesRepository.findById(plant.getSpeciesId()).orElse(null);
        List<CareLogEntity> logs = careLogRepository.findByPlantId(plant.getId()).stream()
                .sorted(Comparator.comparing(CareLogEntity::getTime).reversed())
                .limit(5)
                .toList();
        List<CareTaskEntity> tasks = careTaskRepository.findByPlantId(plant.getId()).stream()
                .sorted(Comparator.comparing(CareTaskEntity::getPlanTime))
                .limit(5)
                .toList();

        StringBuilder context = new StringBuilder();
        context.append("植物昵称：").append(plant.getNickname()).append('\n');
        context.append("品种：").append(species == null ? "未知" : species.getName()).append('\n');
        context.append("位置：").append(plant.getLocation()).append('\n');
        context.append("当前状态：").append(plant.getStatus()).append('\n');
        if (species != null) {
            context.append("基础养护：浇水周期约").append(species.getWaterCycle())
                    .append("天，施肥周期约").append(species.getFertCycle())
                    .append("天，光照要求：").append(species.getLight()).append('\n');
        }
        context.append("最近日志：").append(logs.isEmpty() ? "暂无" : logs.stream()
                .map(log -> log.getTime() + " " + log.getType() + " " + log.getStatus() + " " + log.getNote())
                .collect(Collectors.joining("；"))).append('\n');
        context.append("待办任务：").append(tasks.isEmpty() ? "暂无" : tasks.stream()
                .map(task -> task.getPlanTime() + " " + task.getType() + " " + task.getPriority() + " " + task.getStatus())
                .collect(Collectors.joining("；")));
        return context.toString();
    }

    private PlantEntity requirePlant(String plantId) {
        return plantRepository.findById(plantId)
                .orElseThrow(() -> new IllegalArgumentException("植物不存在: " + plantId));
    }

    private Map<String, PlantGrowthSeries> buildGrowthData() {
        Map<String, List<PlantGrowthPointEntity>> grouped = plantGrowthPointRepository.findAll().stream()
                .collect(Collectors.groupingBy(PlantGrowthPointEntity::getPlantId, LinkedHashMap::new, Collectors.toList()));
        Map<String, PlantGrowthSeries> result = new LinkedHashMap<>();
        for (Map.Entry<String, List<PlantGrowthPointEntity>> entry : grouped.entrySet()) {
            result.put(entry.getKey(), new PlantGrowthSeries(
                    points(entry.getValue(), "height"),
                    points(entry.getValue(), "leaves"),
                    points(entry.getValue(), "health")
            ));
        }
        return result;
    }

    private List<GrowthPoint> points(List<PlantGrowthPointEntity> values, String metric) {
        return values.stream()
                .filter(item -> metric.equals(item.getMetric()))
                .sorted(Comparator.comparing(PlantGrowthPointEntity::getDate))
                .map(item -> new GrowthPoint(item.getDate(), item.getValue()))
                .toList();
    }

    private String nextId(String prefix) {
        return prefix + idCounter.incrementAndGet();
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
