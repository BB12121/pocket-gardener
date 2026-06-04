package com.pocketgardener.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiClientService {
    private static final Logger log = LoggerFactory.getLogger(AiClientService.class);
    private static final Pattern JSON_OBJECT = Pattern.compile("\\{[\\s\\S]*}");

    private final AiClientProperties properties;
    private final AiHttpClient httpClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiClientService(AiClientProperties properties, AiHttpClient httpClient) {
        this.properties = properties;
        this.httpClient = httpClient;
    }

    public Optional<AiAdvice> generateCareAdvice(String context) {
        if (!properties.configured()) {
            log.info("AI client is not configured; using local care advice fallback");
            return Optional.empty();
        }
        try {
            String content = chatCompletion(careAdviceBody(context));
            if (content.isBlank()) {
                return Optional.empty();
            }
            return Optional.of(new AiAdvice(properties.effectiveModel(), firstSentence(content), content));
        } catch (Exception exception) {
            log.warn("AI care advice request failed: {}", exception.getMessage());
            return Optional.empty();
        }
    }

    public Optional<PlantIdentification> identifyPlant(String imageDataUrl) {
        if (!properties.configured()) {
            log.info("AI client is not configured; plant identification is unavailable");
            return Optional.empty();
        }
        try {
            String content = chatCompletion(plantIdentificationBody(imageDataUrl));
            JsonNode json = objectMapper.readTree(extractJson(content));
            String speciesName = json.path("speciesName").asText("");
            if (speciesName.isBlank()) {
                return Optional.empty();
            }
            double confidence = json.path("confidence").asDouble(0.0);
            String care = json.path("care").asText("请根据植物状态调整浇水、光照和通风。");
            return Optional.of(new PlantIdentification(
                    speciesName,
                    confidence,
                    care,
                    optionalDouble(json, "height"),
                    optionalDouble(json, "leaves"),
                    optionalDouble(json, "health")
            ));
        } catch (Exception exception) {
            log.warn("AI plant identification request failed: {}", exception.getMessage());
            return Optional.empty();
        }
    }

    private String chatCompletion(String body) throws Exception {
        String response = httpClient.postJson(
                URI.create(properties.effectiveBaseUrl() + "/v1/chat/completions"),
                body,
                properties.apiKey()
        );
        return objectMapper.readTree(response)
                .path("choices").path(0).path("message").path("content").asText("");
    }

    private String careAdviceBody(String context) throws Exception {
        ObjectNode root = baseRequest(500);
        ArrayNode messages = root.putArray("messages");
        messages.add(message("system", "你是口袋园丁应用的植物养护助手。请基于用户给出的植物档案、养护日志、任务和天气信息，输出专业但简洁的中文建议。不要编造外部数据。"));
        messages.add(message("user", context + "\n请输出：1）风险等级：低/中/高；2）一句话摘要；3）3-5条具体养护建议。"));
        return objectMapper.writeValueAsString(root);
    }

    private String plantIdentificationBody(String imageDataUrl) throws Exception {
        ObjectNode root = baseRequest(220);
        ArrayNode messages = root.putArray("messages");
        ObjectNode user = objectMapper.createObjectNode();
        user.put("role", "user");
        ArrayNode content = user.putArray("content");
        ObjectNode text = objectMapper.createObjectNode();
        text.put("type", "text");
        text.put("text", "请识别图片中的植物，并估算可见生长数据。严格只返回JSON：{\"speciesName\":\"中文名\",\"confidence\":0到1之间的小数,\"care\":\"一句养护建议\",\"height\":高度厘米数字或null,\"leaves\":可见叶片数数字或null,\"health\":健康评分0到100数字或null}。如果图片缺少比例尺，高度可按常见盆栽尺度估算；无法判断的字段返回null。");
        content.add(text);
        ObjectNode image = objectMapper.createObjectNode();
        image.put("type", "image_url");
        ObjectNode imageUrl = image.putObject("image_url");
        imageUrl.put("url", imageDataUrl);
        content.add(image);
        messages.add(user);
        return objectMapper.writeValueAsString(root);
    }

    private ObjectNode baseRequest(int maxTokens) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", properties.effectiveModel());
        root.put("max_tokens", maxTokens);
        return root;
    }

    private ObjectNode message(String role, String content) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("role", role);
        node.put("content", content);
        return node;
    }

    private String extractJson(String content) {
        Matcher matcher = JSON_OBJECT.matcher(content);
        return matcher.find() ? matcher.group() : content;
    }

    private String firstSentence(String content) {
        String compact = content.replace("\r", "").trim();
        int newline = compact.indexOf('\n');
        if (newline >= 0) {
            compact = compact.substring(0, newline).trim();
        }
        return compact.length() > 60 ? compact.substring(0, 60) + "..." : compact;
    }

    private Double optionalDouble(JsonNode root, String field) {
        JsonNode value = root.path(field);
        if (value.isMissingNode() || value.isNull() || !value.isNumber()) {
            return null;
        }
        double number = value.asDouble();
        return Double.isFinite(number) ? number : null;
    }

    public record AiAdvice(String model, String summary, String detail) {
    }

    public record PlantIdentification(String speciesName, double confidence, String care,
                                      Double height, Double leaves, Double health) {
    }
}
