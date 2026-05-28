package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "care_tasks")
public class CareTaskEntity {
    @Id
    private String id;
    private String plantId;
    private String type;
    private String planTime;
    private String priority;
    private String status;
    private String source;

    protected CareTaskEntity() {
    }

    public CareTaskEntity(String id, String plantId, String type, String planTime, String priority, String status, String source) {
        this.id = id;
        this.plantId = plantId;
        this.type = type;
        this.planTime = planTime;
        this.priority = priority;
        this.status = status;
        this.source = source;
    }

    public String getId() { return id; }
    public String getPlantId() { return plantId; }
    public String getType() { return type; }
    public String getPlanTime() { return planTime; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getSource() { return source; }
    public void setStatus(String status) { this.status = status; }
}
