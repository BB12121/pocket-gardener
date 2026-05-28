package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "plant_growth_points")
public class PlantGrowthPointEntity {
    @Id
    private String id;
    private String plantId;
    private String metric;
    private String date;
    @Column(name = "metric_value")
    private double value;

    protected PlantGrowthPointEntity() {
    }

    public PlantGrowthPointEntity(String id, String plantId, String metric, String date, double value) {
        this.id = id;
        this.plantId = plantId;
        this.metric = metric;
        this.date = date;
        this.value = value;
    }

    public String getId() { return id; }
    public String getPlantId() { return plantId; }
    public String getMetric() { return metric; }
    public String getDate() { return date; }
    public double getValue() { return value; }
}
