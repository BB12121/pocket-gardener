package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "community_follows")
public class CommunityFollowEntity {
    @Id
    private String id;
    private String followerUserId;
    private String targetUserId;

    protected CommunityFollowEntity() {
    }

    public CommunityFollowEntity(String followerUserId, String targetUserId) {
        this.id = followerUserId + "::" + targetUserId;
        this.followerUserId = followerUserId;
        this.targetUserId = targetUserId;
    }

    public String getId() { return id; }
    public String getFollowerUserId() { return followerUserId; }
    public String getTargetUserId() { return targetUserId; }
}
