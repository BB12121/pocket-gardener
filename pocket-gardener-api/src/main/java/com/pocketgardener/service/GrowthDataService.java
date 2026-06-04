package com.pocketgardener.service;

import com.pocketgardener.entity.PlantGrowthPointEntity;
import com.pocketgardener.model.DomainModels.GrowthPoint;
import com.pocketgardener.model.DomainModels.PlantGrowthSeries;
import com.pocketgardener.repository.PlantGrowthPointRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GrowthDataService {
    private final BusinessIdGenerator idGenerator;
    private final PlantGrowthPointRepository plantGrowthPointRepository;

    public GrowthDataService(BusinessIdGenerator idGenerator, PlantGrowthPointRepository plantGrowthPointRepository) {
        this.idGenerator = idGenerator;
        this.plantGrowthPointRepository = plantGrowthPointRepository;
    }

    @Transactional
    public void appendGrowthPoints(String plantId, String date, Double height, Double leaves, Double health) {
        saveMetric(plantId, date, "height", height);
        saveMetric(plantId, date, "leaves", leaves);
        saveMetric(plantId, date, "health", health);
    }

    @Transactional(readOnly = true)
    public Map<String, PlantGrowthSeries> buildGrowthData() {
        Map<String, List<PlantGrowthPointEntity>> grouped = plantGrowthPointRepository.findAll().stream()
                .collect(Collectors.groupingBy(PlantGrowthPointEntity::getPlantId, LinkedHashMap::new, Collectors.toList()));
        Map<String, PlantGrowthSeries> result = new LinkedHashMap<>();
        for (Map.Entry<String, List<PlantGrowthPointEntity>> entry : grouped.entrySet()) {
            result.put(entry.getKey(), new PlantGrowthSeries(
                    points(entry.getValue(), "height"),
                    points(entry.getValue(), "leaves"),
                    points(entry.getValue(), "health")
            ));
        }
        return result;
    }

    private List<GrowthPoint> points(List<PlantGrowthPointEntity> values, String metric) {
        return values.stream()
                .filter(item -> metric.equals(item.getMetric()))
                .sorted(Comparator.comparing(PlantGrowthPointEntity::getDate))
                .map(item -> new GrowthPoint(item.getDate(), item.getValue()))
                .toList();
    }

    private void saveMetric(String plantId, String date, String metric, Double value) {
        if (value == null) {
            return;
        }
        if (!Double.isFinite(value) || value < 0) {
            throw new IllegalArgumentException("生长数据必须为非负数");
        }
        plantGrowthPointRepository.save(new PlantGrowthPointEntity(
                idGenerator.nextId("g"),
                plantId,
                metric,
                date,
                value
        ));
    }
}
