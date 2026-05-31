package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.GardenSnapshot;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.service.GardenSnapshotService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class GardenSnapshotController {
    private final GardenSnapshotService gardenSnapshotService;

    public GardenSnapshotController(GardenSnapshotService gardenSnapshotService) {
        this.gardenSnapshotService = gardenSnapshotService;
    }

    @GetMapping("/garden")
    public GardenSnapshot garden(@RequestAttribute("currentUser") UserEntity currentUser) {
        return gardenSnapshotService.snapshot(currentUser);
    }
}
