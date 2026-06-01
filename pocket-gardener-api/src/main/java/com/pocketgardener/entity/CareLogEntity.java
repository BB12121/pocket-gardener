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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "care_log_images", joinColumns = @JoinColumn(name = "log_id"))
    @Column(name = "image", length = 2000000)
    private List<String> images = new ArrayList<>();

    protected CareLogEntity() {
    }

    public CareLogEntity(String id, String plantId, String type, String time, String note, String status) {
        this(id, plantId, type, time, note, status, List.of());
    }

    public CareLogEntity(String id, String plantId, String type, String time, String note, String status, List<String> images) {
        this.id = id;
        this.plantId = plantId;
        this.type = type;
        this.time = time;
        this.note = note;
        this.status = status;
        this.images = new ArrayList<>(images);
    }

    public String getId() { return id; }
    public String getPlantId() { return plantId; }
    public String getType() { return type; }
    public String getTime() { return time; }
    public String getNote() { return note; }
    public String getStatus() { return status; }
    public List<String> getImages() { return images; }
}
