package com.pocketgardener.mapper;

import com.pocketgardener.entity.*;
import com.pocketgardener.model.DomainModels.*;

public final class GardenMapper {
    private GardenMapper() {
    }

    public static User toDto(UserEntity item) {
        return new User(item.getId(), item.getUsername(), item.getPhone(), item.getRegisterTime(), item.getCity(), item.getReputation(), item.getAvatar());
    }

    public static Species toDto(SpeciesEntity item) {
        return new Species(item.getId(), item.getName(), item.getLatin(), item.getCategory(), item.getWaterCycle(), item.getFertCycle(), item.getLight());
    }

    public static Plant toDto(PlantEntity item) {
        return new Plant(item.getId(), item.getNickname(), item.getSpeciesId(), item.getCreateDate(), item.getPurchaseDate(), item.getLocation(), item.getStatus(), item.getTags(), item.getImage());
    }

    public static CareLog toDto(CareLogEntity item) {
        return new CareLog(item.getId(), item.getPlantId(), item.getType(), item.getTime(), item.getNote(), item.getStatus());
    }

    public static CareTask toDto(CareTaskEntity item) {
        return new CareTask(item.getId(), item.getPlantId(), item.getType(), item.getPlanTime(), item.getPriority(), item.getStatus(), item.getSource());
    }

    public static AiSuggestion toDto(AiSuggestionEntity item) {
        return new AiSuggestion(item.getId(), item.getPlantId(), item.getTime(), item.getRisk(), item.getModel(), item.getSummary(), item.getDetail());
    }

    public static WeatherAlert toDto(WeatherAlertEntity item) {
        return new WeatherAlert(item.getId(), item.getType(), item.getLevel(), item.getTime(), item.getSuggestion(), item.getAffectedPlants());
    }

    public static CommunityUser toDto(CommunityUserEntity item) {
        return new CommunityUser(item.getId(), item.getName(), item.getBio(), item.getCity(), item.getFollowers(), item.getFollowing());
    }

    public static CommunityPost toDto(CommunityPostEntity item) {
        return new CommunityPost(item.getId(), item.getType(), item.getAuthorId(), item.getAuthor(), item.getTitle(), item.getContent(), item.getTime(), item.getLikes(), item.getComments(), item.getTags(), item.getUrgent(), item.getImages());
    }

    public static PostComment toDto(PostCommentEntity item) {
        return new PostComment(item.getId(), item.getPostId(), item.getAuthorId(), item.getAuthor(), item.getContent(), item.getTime());
    }

    public static Achievement toDto(AchievementEntity item) {
        return new Achievement(item.getId(), item.getName(), item.getDesc(), item.isAchieved(), item.getProgress(), item.getTarget());
    }
}
