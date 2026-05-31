package com.pocketgardener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "community_comments")
public class PostCommentEntity {
    @Id
    private String id;
    private String postId;
    private String authorId;
    private String author;
    @Column(length = 1000)
    private String content;
    private String time;

    protected PostCommentEntity() {
    }

    public PostCommentEntity(String id, String postId, String authorId, String author, String content, String time) {
        this.id = id;
        this.postId = postId;
        this.authorId = authorId;
        this.author = author;
        this.content = content;
        this.time = time;
    }

    public String getId() { return id; }
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getAuthor() { return author; }
    public String getContent() { return content; }
    public String getTime() { return time; }
}
