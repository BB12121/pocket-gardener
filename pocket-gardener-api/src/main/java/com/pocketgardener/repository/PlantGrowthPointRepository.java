package com.pocketgardener.repository;

import com.pocketgardener.entity.PlantGrowthPointEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantGrowthPointRepository extends JpaRepository<PlantGrowthPointEntity, String> {
    List<PlantGrowthPointEntity> findByPlantId(String plantId);
}
