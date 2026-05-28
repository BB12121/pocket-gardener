package com.pocketgardener.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pocketgardener.model.DomainModels.CurrentWeather;
import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.model.DomainModels.WeatherAlert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class QWeatherService {
    private static final Logger log = LoggerFactory.getLogger(QWeatherService.class);
    private static final DateTimeFormatter DISPLAY_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final QWeatherProperties properties;
    private final QWeatherHttpClient httpClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QWeatherService(QWeatherProperties properties, QWeatherHttpClient httpClient) {
        this.properties = properties;
        this.httpClient = httpClient;
    }

    public Optional<QWeatherResult> fetch(List<Plant> plants) {
        if (!properties.configured()) {
            log.info("QWeather is not configured; falling back to local weather data");
            return Optional.empty();
        }
        try {
            JsonNode nowRoot = objectMapper.readTree(httpClient.get(buildUri("/v7/weather/now")));
            if (!"200".equals(nowRoot.path("code").asText())) {
                log.warn("QWeather weather-now returned code {}", nowRoot.path("code").asText());
                return Optional.empty();
            }

            JsonNode now = nowRoot.path("now");
            CurrentWeather current = new CurrentWeather(
                    properties.effectiveCity(),
                    now.path("temp").asText("--"),
                    now.path("text").asText("未知"),
                    now.path("humidity").asText("--"),
                    formatTime(nowRoot.path("updateTime").asText(""))
            );

            List<WeatherAlert> alerts = fetchWarningsSafely(plants);
            return Optional.of(new QWeatherResult(current, alerts));
        } catch (Exception exception) {
            log.warn("QWeather weather-now request failed: {}", exception.getMessage());
            return Optional.empty();
        }
    }

    private List<WeatherAlert> fetchWarningsSafely(List<Plant> plants) {
        try {
            return fetchWarnings(plants);
        } catch (Exception exception) {
            log.warn("QWeather warning request failed: {}", exception.getMessage());
            return List.of();
        }
    }

    private List<WeatherAlert> fetchWarnings(List<Plant> plants) throws Exception {
        JsonNode warningRoot = objectMapper.readTree(httpClient.get(buildUri("/v7/warning/now")));
        if (!"200".equals(warningRoot.path("code").asText())) {
            return List.of();
        }

        List<WeatherAlert> result = new ArrayList<>();
        for (JsonNode warning : warningRoot.path("warning")) {
            String type = warning.path("typeName").asText("天气") + "预警";
            result.add(new WeatherAlert(
                    "qw-" + blankToDefault(warning.path("id").asText(), String.valueOf(result.size() + 1)),
                    type,
                    severityName(warning.path("severityColor").asText()),
                    formatTime(warning.path("pubTime").asText("")),
                    suggestion(type, warning.path("text").asText("请关注天气变化，及时调整植物养护计划。")),
                    affectedPlants(type, plants)
            ));
        }
        return result;
    }

    private URI buildUri(String path) {
        return UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(properties.effectiveHost())
                .path(path)
                .queryParam("location", properties.effectiveLocation())
                .queryParam("key", properties.apiKey())
                .build(true)
                .toUri();
    }

    private String severityName(String color) {
        return switch (color.toLowerCase(Locale.ROOT)) {
            case "red" -> "红色";
            case "orange" -> "橙色";
            case "yellow" -> "黄色";
            case "blue" -> "蓝色";
            default -> color.isBlank() ? "提示" : color;
        };
    }

    private String suggestion(String type, String originalText) {
        if (type.contains("高温")) {
            return "建议将阳台植物移至散射光处，增加通风，避开中午直晒。";
        }
        if (type.contains("雨") || type.contains("风")) {
            return "建议收回阳台植物或加固花盆，避免强风雨造成倒伏、积水和烂根。";
        }
        if (type.contains("寒") || type.contains("雪") || type.contains("冻")) {
            return "建议将不耐寒植物移入室内，减少浇水并避免夜间低温伤害。";
        }
        return originalText.isBlank() ? "请关注天气变化，及时调整植物养护计划。" : originalText;
    }

    private List<String> affectedPlants(String type, List<Plant> plants) {
        return plants.stream()
                .filter(plant -> type.contains("雨") || type.contains("风")
                        ? plant.location().contains("阳台")
                        : true)
                .map(Plant::id)
                .toList();
    }

    private String formatTime(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        try {
            return OffsetDateTime.parse(value).format(DISPLAY_TIME);
        } catch (Exception exception) {
            return value;
        }
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    public record QWeatherResult(CurrentWeather currentWeather, List<WeatherAlert> alerts) {
    }
}
