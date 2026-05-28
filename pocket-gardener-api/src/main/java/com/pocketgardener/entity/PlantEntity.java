package com.pocketgardener.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plants")
public class PlantEntity {
    @Id
    private String id;
    private String nickname;
    private String speciesId;
    private String createDate;
    private String purchaseDate;
    private String location;
    private String status;
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "plant_tags", joinColumns = @JoinColumn(name = "plant_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    protected PlantEntity() {
    }

    public PlantEntity(String id, String nickname, String speciesId, String createDate, String purchaseDate,
                       String location, String status, List<String> tags, String image) {
        this.id = id;
        this.nickname = nickname;
        this.speciesId = speciesId;
        this.createDate = createDate;
        this.purchaseDate = purchaseDate;
        this.location = location;
        this.status = status;
        this.tags = new ArrayList<>(tags);
        this.image = image;
    }

    public String getId() { return id; }
    public String getNickname() { return nickname; }
    public String getSpeciesId() { return speciesId; }
    public String getCreateDate() { return createDate; }
    public String getPurchaseDate() { return purchaseDate; }
    public String getLocation() { return location; }
    public String getStatus() { return status; }
    public List<String> getTags() { return tags; }
    public String getImage() { return image; }
}
