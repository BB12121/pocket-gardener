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
@Table(name = "community_posts")
public class CommunityPostEntity {
    @Id
    private String id;
    private String type;
    private String authorId;
    private String author;
    private String title;
    @Column(length = 2000)
    private String content;
    private String time;
    private int likes;
    private int comments;
    private String urgent;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "community_post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "community_post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image")
    private List<String> images = new ArrayList<>();

    protected CommunityPostEntity() {
    }

    public CommunityPostEntity(String id, String type, String authorId, String author, String title, String content,
                               String time, int likes, int comments, List<String> tags, String urgent, List<String> images) {
        this.id = id;
        this.type = type;
        this.authorId = authorId;
        this.author = author;
        this.title = title;
        this.content = content;
        this.time = time;
        this.likes = likes;
        this.comments = comments;
        this.tags = new ArrayList<>(tags);
        this.urgent = urgent;
        this.images = new ArrayList<>(images);
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public String getAuthorId() { return authorId; }
    public String getAuthor() { return author; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getTime() { return time; }
    public int getLikes() { return likes; }
    public int getComments() { return comments; }
    public List<String> getTags() { return tags; }
    public String getUrgent() { return urgent; }
    public List<String> getImages() { return images; }

    public void incrementLikes() {
        this.likes += 1;
    }

    public void incrementComments() {
        this.comments += 1;
    }
}
