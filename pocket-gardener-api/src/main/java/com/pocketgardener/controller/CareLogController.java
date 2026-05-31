package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.CreateLogRequest;
import com.pocketgardener.model.DomainModels.CareLog;
import com.pocketgardener.service.CareLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CareLogController {
    private final CareLogService careLogService;

    public CareLogController(CareLogService careLogService) {
        this.careLogService = careLogService;
    }

    @PostMapping("/logs")
    public CareLog createLog(@Valid @RequestBody CreateLogRequest request) {
        return careLogService.createLog(request);
    }
}
