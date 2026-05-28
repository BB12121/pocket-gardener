package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "checkin_days")
public class CheckinDayEntity {
    @Id
    @Column(name = "checkin_date")
    private String day;

    protected CheckinDayEntity() {
    }

    public CheckinDayEntity(String day) {
        this.day = day;
    }

    public String getDay() { return day; }
}
