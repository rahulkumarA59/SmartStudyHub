package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.auth.AuthResponse;
import com.smartstudyhub.backend.dto.auth.LoginRequest;
import com.smartstudyhub.backend.dto.auth.RegisterRequest;
import com.smartstudyhub.backend.dto.common.ApiMessageResponse;
import com.smartstudyhub.backend.dto.user.UserResponse;
import com.smartstudyhub.backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        return authService.register(request, session);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        return authService.login(request, session);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(HttpSession session) {
        return authService.getCurrentUser(session);
    }

    @PostMapping("/logout")
    public ApiMessageResponse logout(HttpSession session) {
        return authService.logout(session);
    }
}
