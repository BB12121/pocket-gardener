package com.pocketgardener.service;

import com.pocketgardener.entity.PlantEntity;
import org.springframework.stereotype.Component;

@Component
public class CareAdvicePolicy {
    public AiClientService.AiAdvice fallbackAdvice(PlantEntity plant) {
        return new AiClientService.AiAdvice(
                "Local-Rule-Gardener",
                plant.getNickname() + "近期养护建议",
                "系统根据该植物的养护日志、任务状态和天气预警生成建议：保持当前浇水节奏，避免盆土长期积水，并观察叶片变化。"
        );
    }

    public String riskLevel(PlantEntity plant) {
        return "健康".equals(plant.getStatus()) ? "低" : "中";
    }
}
