package com.pocketgardener;

import com.pocketgardener.service.AiClientProperties;
import com.pocketgardener.service.AiClientService;
import org.junit.jupiter.api.Test;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThat;

class AiClientServiceTest {
    @Test
    void generateCareAdviceMapsChatCompletionResponse() {
        AiClientService service = new AiClientService(
                new AiClientProperties("https://api.example.test", "test-key", "gpt-5.4-mini"),
                (URI uri, String body, String apiKey) -> {
                    assertThat(uri.toString()).isEqualTo("https://api.example.test/v1/chat/completions");
                    assertThat(apiKey).isEqualTo("test-key");
                    assertThat(body).contains("gpt-5.4-mini");
                    assertThat(body).contains("绿萝");
                    return """
                            {
                              "choices": [
                                {
                                  "message": {
                                    "content": "建议保持散射光，表土干后浇透，未来一周避免积水。"
                                  }
                                }
                              ]
                            }
                            """;
                }
        );

        AiClientService.AiAdvice advice = service.generateCareAdvice("植物：绿萝，位置：客厅").orElseThrow();

        assertThat(advice.model()).isEqualTo("gpt-5.4-mini");
        assertThat(advice.detail()).contains("散射光");
        assertThat(advice.summary()).isEqualTo("建议保持散射光，表土干后浇透，未来一周避免积水。");
    }

    @Test
    void generateCareAdviceReturnsEmptyWhenApiKeyMissing() {
        AiClientService service = new AiClientService(
                new AiClientProperties("https://api.example.test", "", "gpt-5.4-mini"),
                (uri, body, apiKey) -> {
                    throw new AssertionError("HTTP should not be called without credentials");
                }
        );

        assertThat(service.generateCareAdvice("植物：绿萝")).isEmpty();
    }

    @Test
    void identifyPlantMapsVisionJsonResponse() {
        AiClientService service = new AiClientService(
                new AiClientProperties("https://api.example.test", "test-key", "gpt-5.4-mini"),
                (URI uri, String body, String apiKey) -> {
                    assertThat(uri.toString()).isEqualTo("https://api.example.test/v1/chat/completions");
                    assertThat(apiKey).isEqualTo("test-key");
                    assertThat(body).contains("image_url");
                    assertThat(body).contains("data:image/jpeg;base64,abc");
                    return """
                            {
                              "choices": [
                                {
                                  "message": {
                                    "content": "{\\"speciesName\\":\\"龟背竹\\",\\"confidence\\":0.97,\\"care\\":\\"明亮散射光，土干再浇。\\"}"
                                  }
                                }
                              ]
                            }
                            """;
                }
        );

        AiClientService.PlantIdentification result = service.identifyPlant("data:image/jpeg;base64,abc").orElseThrow();

        assertThat(result.speciesName()).isEqualTo("龟背竹");
        assertThat(result.confidence()).isEqualTo(0.97);
        assertThat(result.care()).contains("散射光");
    }
}
