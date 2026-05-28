package com.pocketgardener.repository;

import com.pocketgardener.entity.CareTaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareTaskRepository extends JpaRepository<CareTaskEntity, String> {
    List<CareTaskEntity> findByPlantId(String plantId);
}
