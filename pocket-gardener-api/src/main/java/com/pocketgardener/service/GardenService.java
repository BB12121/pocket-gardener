package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CreateLogRequest;
import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.dto.GardenDtos.CreateTaskRequest;
import com.pocketgardener.dto.GardenDtos.GardenSnapshot;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantRequest;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantResponse;
import com.pocketgardener.model.DomainModels.AiSuggestion;
import com.pocketgardener.model.DomainModels.CareLog;
import com.pocketgardener.model.DomainModels.CareTask;
import com.pocketgardener.model.DomainModels.CommunityPost;
import com.pocketgardener.model.DomainModels.Plant;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GardenService {
    private final GardenSnapshotService gardenSnapshotService;
    private final PlantProfileService plantProfileService;
    private final CareLogService careLogService;
    private final CareTaskService careTaskService;
    private final AiSuggestionService aiSuggestionService;
    private final CommunityService communityService;

    public GardenService(GardenSnapshotService gardenSnapshotService,
                         PlantProfileService plantProfileService,
                         CareLogService careLogService,
                         CareTaskService careTaskService,
                         AiSuggestionService aiSuggestionService,
                         CommunityService communityService) {
        this.gardenSnapshotService = gardenSnapshotService;
        this.plantProfileService = plantProfileService;
        this.careLogService = careLogService;
        this.careTaskService = careTaskService;
        this.aiSuggestionService = aiSuggestionService;
        this.communityService = communityService;
    }

    public GardenSnapshot snapshot() {
        return gardenSnapshotService.snapshot();
    }

    public Plant createPlant(CreatePlantRequest request) {
        return plantProfileService.createPlant(request);
    }

    public CareLog createLog(CreateLogRequest request) {
        return careLogService.createLog(request);
    }

    public CareTask createTask(CreateTaskRequest request) {
        return careTaskService.createTask(request);
    }

    public CareTask updateTaskStatus(String taskId, String status) {
        return careTaskService.updateTaskStatus(taskId, status);
    }

    public AiSuggestion generateSuggestion(String plantId) {
        return aiSuggestionService.generateSuggestion(plantId);
    }

    public IdentifyPlantResponse identifyPlant(IdentifyPlantRequest request) {
        return aiSuggestionService.identifyPlant(request);
    }

    public CommunityPost createPost(CreatePostRequest request) {
        return communityService.createPost(gardenSnapshotService.currentUser(), request);
    }

    public List<String> toggleFollow(String userId) {
        return communityService.toggleFollow(userId);
    }
}
