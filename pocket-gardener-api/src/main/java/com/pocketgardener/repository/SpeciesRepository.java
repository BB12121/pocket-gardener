package com.pocketgardener.repository;

import com.pocketgardener.entity.SpeciesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<SpeciesEntity, String> {
    Optional<SpeciesEntity> findByName(String name);
}
