// src/main/java/com/spendwise/SpendwiseApplication.java
// EDIT: Added @EnableScheduling for recurring expenses scheduler.

package com.spendwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpendwiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpendwiseApplication.class, args);
    }
}
