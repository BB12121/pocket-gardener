package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.service.PlantProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class PlantProfileController {
    private final PlantProfileService plantProfileService;

    public PlantProfileController(PlantProfileService plantProfileService) {
        this.plantProfileService = plantProfileService;
    }

    @PostMapping("/plants")
    public Plant createPlant(@Valid @RequestBody CreatePlantRequest request) {
        return plantProfileService.createPlant(request);
    }
}
