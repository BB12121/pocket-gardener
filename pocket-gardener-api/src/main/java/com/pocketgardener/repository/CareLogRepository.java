package com.pocketgardener.repository;

import com.pocketgardener.entity.CareLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareLogRepository extends JpaRepository<CareLogEntity, String> {
    List<CareLogEntity> findByPlantId(String plantId);
}
