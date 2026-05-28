package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "species")
public class SpeciesEntity {
    @Id
    private String id;
    private String name;
    private String latin;
    private String category;
    private int waterCycle;
    private int fertCycle;
    private String light;

    protected SpeciesEntity() {
    }

    public SpeciesEntity(String id, String name, String latin, String category, int waterCycle, int fertCycle, String light) {
        this.id = id;
        this.name = name;
        this.latin = latin;
        this.category = category;
        this.waterCycle = waterCycle;
        this.fertCycle = fertCycle;
        this.light = light;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getLatin() { return latin; }
    public String getCategory() { return category; }
    public int getWaterCycle() { return waterCycle; }
    public int getFertCycle() { return fertCycle; }
    public String getLight() { return light; }
}
