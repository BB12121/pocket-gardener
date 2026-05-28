package com.pocketgardener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    private String id;
    @Column(unique = true)
    private String loginName;
    private String passwordHash;
    @Column(unique = true)
    private String authToken;
    private String username;
    private String phone;
    private String registerTime;
    private String city;
    private int reputation;
    @Column(length = 32)
    private String avatar;

    protected UserEntity() {
    }

    public UserEntity(String id, String username, String phone, String registerTime, String city, int reputation, String avatar) {
        this(id, null, null, null, username, phone, registerTime, city, reputation, avatar);
    }

    public UserEntity(String id, String loginName, String passwordHash, String authToken, String username, String phone, String registerTime, String city, int reputation, String avatar) {
        this.id = id;
        this.loginName = loginName;
        this.passwordHash = passwordHash;
        this.authToken = authToken;
        this.username = username;
        this.phone = phone;
        this.registerTime = registerTime;
        this.city = city;
        this.reputation = reputation;
        this.avatar = avatar;
    }

    public String getId() { return id; }
    public String getLoginName() { return loginName; }
    public String getPasswordHash() { return passwordHash; }
    public String getAuthToken() { return authToken; }
    public String getUsername() { return username; }
    public String getPhone() { return phone; }
    public String getRegisterTime() { return registerTime; }
    public String getCity() { return city; }
    public int getReputation() { return reputation; }
    public String getAvatar() { return avatar; }

    public void setLoginName(String loginName) { this.loginName = loginName; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setAuthToken(String authToken) { this.authToken = authToken; }
}
