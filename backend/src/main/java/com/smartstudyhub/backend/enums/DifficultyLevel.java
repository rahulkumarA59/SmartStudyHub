package com.smartstudyhub.backend.enums;

import java.util.Arrays;

public enum DifficultyLevel {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED;

    public static DifficultyLevel fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return BEGINNER;
        }

        return Arrays.stream(values())
                .filter(level -> level.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid level: " + value));
    }

    public String toFrontendValue() {
        return switch (this) {
            case BEGINNER -> "Beginner";
            case INTERMEDIATE -> "Intermediate";
            case ADVANCED -> "Advanced";
        };
    }
}
