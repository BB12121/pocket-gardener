package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.entity.PlantEntity;
import com.pocketgardener.entity.SpeciesEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.repository.PlantRepository;
import com.pocketgardener.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PlantProfileService {
    private final BusinessIdGenerator idGenerator;
    private final SpeciesRepository speciesRepository;
    private final PlantRepository plantRepository;

    public PlantProfileService(BusinessIdGenerator idGenerator,
                               SpeciesRepository speciesRepository,
                               PlantRepository plantRepository) {
        this.idGenerator = idGenerator;
        this.speciesRepository = speciesRepository;
        this.plantRepository = plantRepository;
    }

    @Transactional
    public Plant createPlant(CreatePlantRequest request) {
        SpeciesEntity matched = speciesRepository.findByName(request.speciesName())
                .orElseGet(() -> speciesRepository.save(new SpeciesEntity(
                        idGenerator.nextId("s"),
                        request.speciesName(),
                        "待补充",
                        "观叶植物",
                        3,
                        14,
                        "散射光"
                )));
        PlantEntity plant = new PlantEntity(
                idGenerator.nextId("p"),
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

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
