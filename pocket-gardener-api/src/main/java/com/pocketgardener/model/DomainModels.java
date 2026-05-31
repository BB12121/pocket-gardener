package com.pocketgardener.model;

import java.util.List;

public final class DomainModels {
    private DomainModels() {
    }

    public record User(String id, String username, String phone, String registerTime, String city, int reputation, String avatar) {
    }

    public record Species(String id, String name, String latin, String category, int waterCycle, int fertCycle, String light) {
    }

    public record Plant(String id, String nickname, String speciesId, String createDate, String purchaseDate,
                        String location, String status, List<String> tags, String image) {
    }

    public record CareLog(String id, String plantId, String type, String time, String note, String status) {
    }

    public record CareTask(String id, String plantId, String type, String planTime, String priority, String status, String source) {
    }

    public record AiSuggestion(String id, String plantId, String time, String risk, String model, String summary, String detail) {
    }

    public record WeatherAlert(String id, String type, String level, String time, String suggestion, List<String> affectedPlants) {
    }

    public record CurrentWeather(String city, String temperature, String condition, String humidity, String updateTime) {
    }

    public record CommunityUser(String id, String name, String bio, String city, int followers, int following) {
    }

    public record CommunityPost(String id, String type, String authorId, String author, String title, String content,
                                String time, int likes, int comments, List<String> tags, String urgent, List<String> images,
                                boolean likedByCurrentUser) {
    }

    public record PostComment(String id, String postId, String authorId, String author, String content, String time) {
    }

    public record Achievement(String id, String name, String desc, boolean achieved, int progress, int target) {
    }

    public record GrowthPoint(String date, double value) {
    }

    public record PlantGrowthSeries(List<GrowthPoint> height, List<GrowthPoint> leaves, List<GrowthPoint> health) {
    }
}
