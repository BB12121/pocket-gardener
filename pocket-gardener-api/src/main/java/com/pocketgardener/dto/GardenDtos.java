package com.pocketgardener.dto;

import com.pocketgardener.model.DomainModels.*;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Map;

public final class GardenDtos {
    private GardenDtos() {
    }

    public record GardenSnapshot(
            User currentUser,
            List<Species> species,
            List<Plant> plants,
            List<CareLog> careLogs,
            List<CareTask> careTasks,
            List<AiSuggestion> aiSuggestions,
            CurrentWeather currentWeather,
            List<WeatherAlert> weatherAlerts,
            List<CommunityUser> communityUsers,
            List<String> followedUsers,
            List<CommunityPost> communityPosts,
            List<Achievement> achievements,
            Map<String, PlantGrowthSeries> plantGrowthData,
            List<String> checkinDays
    ) {
    }

    public record CreatePlantRequest(@NotBlank String nickname, @NotBlank String speciesName,
                                     String location, List<String> tags) {
    }

    public record CreateLogRequest(@NotBlank String plantId, @NotBlank String type, String note, String status,
                                   List<String> images, Double height, Double leaves, Double health) {
    }

    public record CreateTaskRequest(@NotBlank String plantId, @NotBlank String type,
                                    @NotBlank String planTime, @NotBlank String priority) {
    }

    public record UpdateTaskStatusRequest(@NotBlank String status) {
    }

    public record IdentifyPlantRequest(@NotBlank String imageDataUrl) {
    }

    public record IdentifyPlantResponse(String speciesName, double confidence, String care,
                                        Double height, Double leaves, Double health) {
    }

    public record CreatePostRequest(@NotBlank String type, @NotBlank String title,
                                    @NotBlank String content, List<String> tags, List<String> images) {
    }

    public record CreateCommentRequest(@NotBlank String content) {
    }

    public record CommunityPostCommentsResponse(CommunityPost post, List<PostComment> comments) {
    }

    public record LoginRequest(@NotBlank String loginName, @NotBlank String password) {
    }

    public record RegisterRequest(@NotBlank String loginName, @NotBlank String password,
                                  @NotBlank String username, String city) {
    }

    public record AuthResponse(String token, User user) {
    }
}
