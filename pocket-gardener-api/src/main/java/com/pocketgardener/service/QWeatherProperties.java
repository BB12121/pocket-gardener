package com.pocketgardener.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "qweather")
public record QWeatherProperties(
        String host,
        String apiKey,
        String location,
        String city
) {
    public String effectiveHost() {
        return isBlank(host) ? "devapi.qweather.com" : host;
    }

    public String effectiveLocation() {
        return isBlank(location) ? "101210101" : location;
    }

    public String effectiveCity() {
        return isBlank(city) ? "杭州" : city;
    }

    public boolean configured() {
        return !isBlank(apiKey);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
