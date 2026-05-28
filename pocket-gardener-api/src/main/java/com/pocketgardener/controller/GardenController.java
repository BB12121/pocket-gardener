package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.CreateLogRequest;
import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.dto.GardenDtos.CreateTaskRequest;
import com.pocketgardener.dto.GardenDtos.GardenSnapshot;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantRequest;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantResponse;
import com.pocketgardener.dto.GardenDtos.UpdateTaskStatusRequest;
import com.pocketgardener.model.DomainModels.AiSuggestion;
import com.pocketgardener.model.DomainModels.CareLog;
import com.pocketgardener.model.DomainModels.CareTask;
import com.pocketgardener.model.DomainModels.CommunityPost;
import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.service.GardenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class GardenController {
    private final GardenService gardenService;

    public GardenController(GardenService gardenService) {
        this.gardenService = gardenService;
    }

    @GetMapping("/garden")
    public GardenSnapshot garden() {
        return gardenService.snapshot();
    }

    @PostMapping("/plants")
    public Plant createPlant(@Valid @RequestBody CreatePlantRequest request) {
        return gardenService.createPlant(request);
    }

    @PostMapping("/logs")
    public CareLog createLog(@Valid @RequestBody CreateLogRequest request) {
        return gardenService.createLog(request);
    }

    @PostMapping("/tasks")
    public CareTask createTask(@Valid @RequestBody CreateTaskRequest request) {
        return gardenService.createTask(request);
    }

    @PatchMapping("/tasks/{taskId}")
    public CareTask updateTaskStatus(@PathVariable String taskId, @Valid @RequestBody UpdateTaskStatusRequest request) {
        return gardenService.updateTaskStatus(taskId, request.status());
    }

    @PostMapping("/ai/{plantId}/generate")
    public AiSuggestion generateSuggestion(@PathVariable String plantId) {
        return gardenService.generateSuggestion(plantId);
    }

    @PostMapping("/vision/plant")
    public IdentifyPlantResponse identifyPlant(@Valid @RequestBody IdentifyPlantRequest request) {
        return gardenService.identifyPlant(request);
    }

    @PostMapping("/posts")
    public CommunityPost createPost(@Valid @RequestBody CreatePostRequest request) {
        return gardenService.createPost(request);
    }

    @PostMapping("/community-users/{userId}/follow")
    public List<String> toggleFollow(@PathVariable String userId) {
        return gardenService.toggleFollow(userId);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
