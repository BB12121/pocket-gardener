package com.pocketgardener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class PocketGardenerApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(PocketGardenerApiApplication.class, args);
    }
}
