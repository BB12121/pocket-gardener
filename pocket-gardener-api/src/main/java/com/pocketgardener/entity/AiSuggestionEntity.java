package com.pocketgardener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ai_suggestions")
public class AiSuggestionEntity {
    @Id
    private String id;
    private String plantId;
    private String time;
    private String risk;
    private String model;
    private String summary;
    @Column(length = 2000)
    private String detail;

    protected AiSuggestionEntity() {
    }

    public AiSuggestionEntity(String id, String plantId, String time, String risk, String model, String summary, String detail) {
        this.id = id;
        this.plantId = plantId;
        this.time = time;
        this.risk = risk;
        this.model = model;
        this.summary = summary;
        this.detail = detail;
    }

    public String getId() { return id; }
    public String getPlantId() { return plantId; }
    public String getTime() { return time; }
    public String getRisk() { return risk; }
    public String getModel() { return model; }
    public String getSummary() { return summary; }
    public String getDetail() { return detail; }
}
