package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.GardenSnapshot;
import com.pocketgardener.entity.AiSuggestionEntity;
import com.pocketgardener.entity.CareLogEntity;
import com.pocketgardener.entity.CheckinDayEntity;
import com.pocketgardener.entity.CommunityPostEntity;
import com.pocketgardener.entity.FollowedUserEntity;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.CurrentWeather;
import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.model.DomainModels.User;
import com.pocketgardener.model.DomainModels.WeatherAlert;
import com.pocketgardener.repository.AchievementRepository;
import com.pocketgardener.repository.AiSuggestionRepository;
import com.pocketgardener.repository.CareLogRepository;
import com.pocketgardener.repository.CareTaskRepository;
import com.pocketgardener.repository.CheckinDayRepository;
import com.pocketgardener.repository.CommunityPostRepository;
import com.pocketgardener.repository.CommunityUserRepository;
import com.pocketgardener.repository.FollowedUserRepository;
import com.pocketgardener.repository.PlantRepository;
import com.pocketgardener.repository.SpeciesRepository;
import com.pocketgardener.repository.WeatherAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class GardenSnapshotService {
    private final CurrentUserService currentUserService;
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
    private final QWeatherService qWeatherService;
    private final GrowthDataService growthDataService;

    public GardenSnapshotService(CurrentUserService currentUserService,
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
                                 QWeatherService qWeatherService,
                                 GrowthDataService growthDataService) {
        this.currentUserService = currentUserService;
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
        this.qWeatherService = qWeatherService;
        this.growthDataService = growthDataService;
    }

    @Transactional(readOnly = true)
    public UserEntity currentUser() {
        return currentUserService.demoUser();
    }

    @Transactional(readOnly = true)
    public GardenSnapshot snapshot() {
        return snapshot(currentUser());
    }

    @Transactional(readOnly = true)
    public GardenSnapshot snapshot(UserEntity currentUserEntity) {
        User currentUser = GardenMapper.toDto(currentUserEntity);
        List<Plant> plants = plantRepository.findAll().stream().map(GardenMapper::toDto).toList();
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
                growthDataService.buildGrowthData(),
                checkinDayRepository.findAll().stream().map(CheckinDayEntity::getDay).sorted().toList()
        );
    }
}
