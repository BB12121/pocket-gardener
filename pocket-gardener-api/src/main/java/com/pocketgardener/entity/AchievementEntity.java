package com.pocketgardener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "achievements")
public class AchievementEntity {
    @Id
    private String id;
    private String name;
    @Column(name = "description")
    private String desc;
    private boolean achieved;
    private int progress;
    private int target;

    protected AchievementEntity() {
    }

    public AchievementEntity(String id, String name, String desc, boolean achieved, int progress, int target) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.achieved = achieved;
        this.progress = progress;
        this.target = target;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDesc() { return desc; }
    public boolean isAchieved() { return achieved; }
    public int getProgress() { return progress; }
    public int getTarget() { return target; }
}
