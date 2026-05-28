package com.pocketgardener.repository;

import com.pocketgardener.entity.PlantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantRepository extends JpaRepository<PlantEntity, String> {
    Optional<PlantEntity> findByNickname(String nickname);
}
