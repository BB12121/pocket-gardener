package com.pocketgardener.repository;

import com.pocketgardener.entity.WeatherAlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherAlertRepository extends JpaRepository<WeatherAlertEntity, String> {
}
