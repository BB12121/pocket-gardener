package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.IdentifyPlantRequest;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantResponse;
import com.pocketgardener.entity.AiSuggestionEntity;
import com.pocketgardener.entity.CareLogEntity;
import com.pocketgardener.entity.CareTaskEntity;
import com.pocketgardener.entity.PlantEntity;
import com.pocketgardener.entity.SpeciesEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.AiSuggestion;
import com.pocketgardener.repository.AiSuggestionRepository;
import com.pocketgardener.repository.CareLogRepository;
import com.pocketgardener.repository.CareTaskRepository;
import com.pocketgardener.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiSuggestionService {
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final BusinessIdGenerator idGenerator;
    private final PlantLookupService plantLookupService;
    private final SpeciesRepository speciesRepository;
    private final CareLogRepository careLogRepository;
    private final CareTaskRepository careTaskRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final AiClientService aiClientService;
    private final CareAdvicePolicy careAdvicePolicy;

    public AiSuggestionService(BusinessIdGenerator idGenerator,
                               PlantLookupService plantLookupService,
                               SpeciesRepository speciesRepository,
                               CareLogRepository careLogRepository,
                               CareTaskRepository careTaskRepository,
                               AiSuggestionRepository aiSuggestionRepository,
                               AiClientService aiClientService,
                               CareAdvicePolicy careAdvicePolicy) {
        this.idGenerator = idGenerator;
        this.plantLookupService = plantLookupService;
        this.speciesRepository = speciesRepository;
        this.careLogRepository = careLogRepository;
        this.careTaskRepository = careTaskRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.aiClientService = aiClientService;
        this.careAdvicePolicy = careAdvicePolicy;
    }

    @Transactional
    public AiSuggestion generateSuggestion(String plantId) {
        PlantEntity plant = plantLookupService.requirePlant(plantId);
        AiClientService.AiAdvice advice = aiClientService.generateCareAdvice(buildAiContext(plant))
                .orElseGet(() -> careAdvicePolicy.fallbackAdvice(plant));

        AiSuggestionEntity suggestion = new AiSuggestionEntity(
                idGenerator.nextId("a"),
                plantId,
                LocalDateTime.now().format(DATE_TIME),
                careAdvicePolicy.riskLevel(plant),
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
}
