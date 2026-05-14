package com.smartstudyhub.backend.dto.auth;

import com.smartstudyhub.backend.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class AuthResponse {

    private boolean success;
    private String message;
    private UserResponse user;
}
