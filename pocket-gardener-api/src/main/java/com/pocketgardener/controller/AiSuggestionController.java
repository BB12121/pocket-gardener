package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.IdentifyPlantRequest;
import com.pocketgardener.dto.GardenDtos.IdentifyPlantResponse;
import com.pocketgardener.model.DomainModels.AiSuggestion;
import com.pocketgardener.service.AiSuggestionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AiSuggestionController {
    private final AiSuggestionService aiSuggestionService;

    public AiSuggestionController(AiSuggestionService aiSuggestionService) {
        this.aiSuggestionService = aiSuggestionService;
    }

    @PostMapping("/ai/{plantId}/generate")
    public AiSuggestion generateSuggestion(@PathVariable String plantId) {
        return aiSuggestionService.generateSuggestion(plantId);
    }

    @PostMapping("/vision/plant")
    public IdentifyPlantResponse identifyPlant(@Valid @RequestBody IdentifyPlantRequest request) {
        return aiSuggestionService.identifyPlant(request);
    }
}
