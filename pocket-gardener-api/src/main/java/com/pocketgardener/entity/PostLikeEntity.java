package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_likes")
public class PostLikeEntity {
    @Id
    private String id;
    private String postId;
    private String userId;

    protected PostLikeEntity() {
    }

    public PostLikeEntity(String postId, String userId) {
        this.id = postId + "::" + userId;
        this.postId = postId;
        this.userId = userId;
    }

    public String getId() { return id; }
    public String getPostId() { return postId; }
    public String getUserId() { return userId; }
}
