package com.pocketgardener;

import com.pocketgardener.model.DomainModels.Plant;
import com.pocketgardener.service.JavaNetQWeatherHttpClient;
import com.pocketgardener.service.QWeatherProperties;
import com.pocketgardener.service.QWeatherService;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.zip.GZIPOutputStream;
import java.io.ByteArrayOutputStream;

import static org.assertj.core.api.Assertions.assertThat;

class QWeatherServiceTest {
    @Test
    void fetchMapsQWeatherResponseToGardenWeather() {
        QWeatherProperties properties = new QWeatherProperties(
                "devapi.qweather.com",
                "test-key",
                "101210101",
                "杭州"
        );
        QWeatherService service = new QWeatherService(properties, (URI uri) -> {
            assertThat(uri.getHost()).isEqualTo("devapi.qweather.com");
            if (uri.getPath().equals("/v7/weather/now")) {
                return """
                        {
                          "code": "200",
                          "updateTime": "2026-05-28T09:00+08:00",
                          "now": {
                            "temp": "26",
                            "text": "多云",
                            "humidity": "68"
                          }
                        }
                        """;
            }
            if (uri.getPath().equals("/v7/warning/now")) {
                return """
                        {
                          "code": "200",
                          "warning": [
                            {
                              "id": "w-real-1",
                              "pubTime": "2026-05-28T08:30+08:00",
                              "typeName": "雷雨大风",
                              "severityColor": "Orange",
                              "text": "请注意防范强对流天气。"
                            }
                          ]
                        }
                        """;
            }
            throw new IllegalArgumentException("Unexpected path " + uri.getPath());
        });

        QWeatherService.QWeatherResult result = service.fetch(List.of(
                new Plant("p1", "阳台多肉", "s2", "2026-01-01", "2026-01-01", "阳台", "健康", List.of(), ""),
                new Plant("p2", "书房绿萝", "s1", "2026-01-01", "2026-01-01", "书房", "健康", List.of(), "")
        )).orElseThrow();

        assertThat(result.currentWeather().city()).isEqualTo("杭州");
        assertThat(result.currentWeather().temperature()).isEqualTo("26");
        assertThat(result.currentWeather().condition()).isEqualTo("多云");
        assertThat(result.currentWeather().humidity()).isEqualTo("68");
        assertThat(result.alerts()).hasSize(1);
        assertThat(result.alerts().get(0).type()).isEqualTo("雷雨大风预警");
        assertThat(result.alerts().get(0).level()).isEqualTo("橙色");
        assertThat(result.alerts().get(0).affectedPlants()).containsExactly("p1");
    }

    @Test
    void fetchReturnsEmptyWhenCredentialsAreMissing() {
        QWeatherService service = new QWeatherService(
                new QWeatherProperties("devapi.qweather.com", "", "101210101", "杭州"),
                uri -> {
                    throw new AssertionError("HTTP should not be called without credentials");
                }
        );

        assertThat(service.fetch(List.of())).isEmpty();
    }
    @Test
    void warningFailureDoesNotDropCurrentWeather() {
        QWeatherService service = new QWeatherService(
                new QWeatherProperties("devapi.qweather.com", "test-key", "101210101", "杭州"),
                uri -> {
                    if (uri.getPath().equals("/v7/weather/now")) {
                        return """
                                {
                                  "code": "200",
                                  "updateTime": "2026-05-28T09:00+08:00",
                                  "now": { "temp": "25", "text": "多云", "humidity": "69" }
                                }
                                """;
                    }
                    throw new java.io.IOException("QWeather HTTP 403");
                }
        );

        QWeatherService.QWeatherResult result = service.fetch(List.of()).orElseThrow();

        assertThat(result.currentWeather().temperature()).isEqualTo("25");
        assertThat(result.alerts()).isEmpty();
    }

    @Test
    void javaHttpClientDecodesGzipResponses() throws Exception {
        String json = "{\"code\":\"200\"}";
        String decoded = JavaNetQWeatherHttpClient.decodeBody(gzip(json), "gzip");

        assertThat(decoded).isEqualTo(json);
    }

    private byte[] gzip(String value) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (GZIPOutputStream gzip = new GZIPOutputStream(out)) {
            gzip.write(value.getBytes(StandardCharsets.UTF_8));
        }
        return out.toByteArray();
    }
}
