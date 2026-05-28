package com.pocketgardener.repository;

import com.pocketgardener.entity.AiSuggestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiSuggestionRepository extends JpaRepository<AiSuggestionEntity, String> {
    List<AiSuggestionEntity> findByPlantId(String plantId);
}
