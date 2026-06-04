package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CreateLogRequest;
import com.pocketgardener.entity.CareLogEntity;
import com.pocketgardener.entity.CheckinDayEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.CareLog;
import com.pocketgardener.repository.CareLogRepository;
import com.pocketgardener.repository.CheckinDayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CareLogService {
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final BusinessIdGenerator idGenerator;
    private final PlantLookupService plantLookupService;
    private final CareLogRepository careLogRepository;
    private final CheckinDayRepository checkinDayRepository;
    private final GrowthDataService growthDataService;

    public CareLogService(BusinessIdGenerator idGenerator,
                          PlantLookupService plantLookupService,
                          CareLogRepository careLogRepository,
                          CheckinDayRepository checkinDayRepository,
                          GrowthDataService growthDataService) {
        this.idGenerator = idGenerator;
        this.plantLookupService = plantLookupService;
        this.careLogRepository = careLogRepository;
        this.checkinDayRepository = checkinDayRepository;
        this.growthDataService = growthDataService;
    }

    @Transactional
    public CareLog createLog(CreateLogRequest request) {
        plantLookupService.requirePlant(request.plantId());
        String logTime = LocalDateTime.now().format(DATE_TIME);
        CareLogEntity log = new CareLogEntity(
                idGenerator.nextId("l"),
                request.plantId(),
                request.type(),
                logTime,
                blankToDefault(request.note(), "无备注"),
                blankToDefault(request.status(), "正常"),
                safeImages(request.images())
        );
        String today = LocalDate.now().toString();
        if (!checkinDayRepository.existsById(today)) {
            checkinDayRepository.save(new CheckinDayEntity(today));
        }
        growthDataService.appendGrowthPoints(request.plantId(), logTime.substring(0, 10), request.height(), request.leaves(), request.health());
        return GardenMapper.toDto(careLogRepository.save(log));
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private List<String> safeImages(List<String> images) {
        if (images == null) {
            return List.of();
        }
        return images.stream()
                .filter(image -> image != null && !image.isBlank())
                .limit(3)
                .toList();
    }
}
