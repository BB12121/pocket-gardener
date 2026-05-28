package com.pocketgardener.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai")
public record AiClientProperties(
        String baseUrl,
        String apiKey,
        String model
) {
    public boolean configured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String effectiveBaseUrl() {
        return baseUrl == null || baseUrl.isBlank() ? "https://api.openai.com" : baseUrl.replaceAll("/+$", "");
    }

    public String effectiveModel() {
        return model == null || model.isBlank() ? "gpt-5.4-mini" : model;
    }
}
