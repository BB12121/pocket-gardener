package com.pocketgardener.service;

import java.io.IOException;
import java.net.URI;

@FunctionalInterface
public interface QWeatherHttpClient {
    String get(URI uri) throws IOException, InterruptedException;
}
