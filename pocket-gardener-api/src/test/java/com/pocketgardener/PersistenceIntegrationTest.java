package com.pocketgardener;

import com.pocketgardener.dto.GardenDtos.CreatePlantRequest;
import com.pocketgardener.repository.PlantRepository;
import com.pocketgardener.service.GardenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class PersistenceIntegrationTest {
    @Autowired
    private GardenService gardenService;

    @Autowired
    private PlantRepository plantRepository;

    @Test
    void createPlantPersistsThroughRepository() {
        long before = plantRepository.count();

        gardenService.createPlant(new CreatePlantRequest("数据库绿萝", "绿萝", "书房", List.of("耐阴")));

        assertThat(plantRepository.count()).isEqualTo(before + 1);
        assertThat(plantRepository.findByNickname("数据库绿萝")).isPresent();
    }
}
