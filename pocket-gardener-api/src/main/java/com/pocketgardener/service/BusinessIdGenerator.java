package com.pocketgardener.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class BusinessIdGenerator {
    private final AtomicLong counter = new AtomicLong(System.currentTimeMillis());

    public String nextId(String prefix) {
        return prefix + counter.incrementAndGet();
    }
}
