package com.pocketgardener.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weather_alerts")
public class WeatherAlertEntity {
    @Id
    private String id;
    private String type;
    private String level;
    private String time;
    @Column(length = 1000)
    private String suggestion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "weather_alert_affected_plants", joinColumns = @JoinColumn(name = "alert_id"))
    @Column(name = "plant_id")
    private List<String> affectedPlants = new ArrayList<>();

    protected WeatherAlertEntity() {
    }

    public WeatherAlertEntity(String id, String type, String level, String time, String suggestion, List<String> affectedPlants) {
        this.id = id;
        this.type = type;
        this.level = level;
        this.time = time;
        this.suggestion = suggestion;
        this.affectedPlants = new ArrayList<>(affectedPlants);
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public String getLevel() { return level; }
    public String getTime() { return time; }
    public String getSuggestion() { return suggestion; }
    public List<String> getAffectedPlants() { return affectedPlants; }
}
