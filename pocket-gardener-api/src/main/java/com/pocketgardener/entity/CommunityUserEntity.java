package com.pocketgardener.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "community_users")
public class CommunityUserEntity {
    @Id
    private String id;
    private String name;
    private String bio;
    private String city;
    private int followers;
    private int following;

    protected CommunityUserEntity() {
    }

    public CommunityUserEntity(String id, String name, String bio, String city, int followers, int following) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.city = city;
        this.followers = followers;
        this.following = following;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getBio() { return bio; }
    public String getCity() { return city; }
    public int getFollowers() { return followers; }
    public int getFollowing() { return following; }
}
