package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "followed_users")
public class FollowedUserEntity {
    @Id
    private String userId;

    protected FollowedUserEntity() {
    }

    public FollowedUserEntity(String userId) {
        this.userId = userId;
    }

    public String getUserId() { return userId; }
}
