package com.pocketgardener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "care_logs")
public class CareLogEntity {
    @Id
    private String id;
    private String plantId;
    private String type;
    private String time;
    @Column(length = 1000)
    private String note;
    private String status;

    protected CareLogEntity() {
    }

    public CareLogEntity(String id, String plantId, String type, String time, String note, String status) {
        this.id = id;
        this.plantId = plantId;
        this.type = type;
        this.time = time;
        this.note = note;
        this.status = status;
    }

    public String getId() { return id; }
    public String getPlantId() { return plantId; }
    public String getType() { return type; }
    public String getTime() { return time; }
    public String getNote() { return note; }
    public String getStatus() { return status; }
}
