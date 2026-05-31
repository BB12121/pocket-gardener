package com.pocketgardener.service;

import com.pocketgardener.entity.PlantEntity;
import com.pocketgardener.repository.PlantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlantLookupService {
    private final PlantRepository plantRepository;

    public PlantLookupService(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    @Transactional(readOnly = true)
    public PlantEntity requirePlant(String plantId) {
        return plantRepository.findById(plantId)
                .orElseThrow(() -> new IllegalArgumentException("植物不存在: " + plantId));
    }
}
