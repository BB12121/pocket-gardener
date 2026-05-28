package com.pocketgardener.repository;

import com.pocketgardener.entity.AchievementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<AchievementEntity, String> {
}
