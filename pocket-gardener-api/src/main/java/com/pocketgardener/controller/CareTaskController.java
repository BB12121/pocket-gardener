package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.CreateTaskRequest;
import com.pocketgardener.dto.GardenDtos.UpdateTaskStatusRequest;
import com.pocketgardener.model.DomainModels.CareTask;
import com.pocketgardener.service.CareTaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CareTaskController {
    private final CareTaskService careTaskService;

    public CareTaskController(CareTaskService careTaskService) {
        this.careTaskService = careTaskService;
    }

    @PostMapping("/tasks")
    public CareTask createTask(@Valid @RequestBody CreateTaskRequest request) {
        return careTaskService.createTask(request);
    }

    @PatchMapping("/tasks/{taskId}")
    public CareTask updateTaskStatus(@PathVariable String taskId, @Valid @RequestBody UpdateTaskStatusRequest request) {
        return careTaskService.updateTaskStatus(taskId, request.status());
    }
}
