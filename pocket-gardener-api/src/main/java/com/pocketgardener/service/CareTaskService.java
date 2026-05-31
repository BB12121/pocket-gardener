package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CreateTaskRequest;
import com.pocketgardener.entity.CareTaskEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.CareTask;
import com.pocketgardener.repository.CareTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CareTaskService {
    private final BusinessIdGenerator idGenerator;
    private final PlantLookupService plantLookupService;
    private final CareTaskRepository careTaskRepository;

    public CareTaskService(BusinessIdGenerator idGenerator,
                           PlantLookupService plantLookupService,
                           CareTaskRepository careTaskRepository) {
        this.idGenerator = idGenerator;
        this.plantLookupService = plantLookupService;
        this.careTaskRepository = careTaskRepository;
    }

    @Transactional
    public CareTask createTask(CreateTaskRequest request) {
        plantLookupService.requirePlant(request.plantId());
        CareTaskEntity task = new CareTaskEntity(
                idGenerator.nextId("t"),
                request.plantId(),
                request.type(),
                request.planTime().replace('T', ' '),
                request.priority(),
                "待处理",
                "手动创建"
        );
        return GardenMapper.toDto(careTaskRepository.save(task));
    }

    @Transactional
    public CareTask updateTaskStatus(String taskId, String status) {
        CareTaskEntity task = careTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在: " + taskId));
        task.setStatus(status);
        return GardenMapper.toDto(careTaskRepository.save(task));
    }
}
