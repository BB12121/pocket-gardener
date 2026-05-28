package com.pocketgardener.service;

import java.io.IOException;
import java.net.URI;

@FunctionalInterface
public interface AiHttpClient {
    String postJson(URI uri, String body, String apiKey) throws IOException, InterruptedException;
}
