package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.auth.AuthResponse;
import com.smartstudyhub.backend.dto.auth.LoginRequest;
import com.smartstudyhub.backend.dto.auth.RegisterRequest;
import com.smartstudyhub.backend.dto.common.ApiMessageResponse;
import com.smartstudyhub.backend.dto.user.UserResponse;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.ConflictException;
import com.smartstudyhub.backend.exception.UnauthorizedException;
import com.smartstudyhub.backend.mapper.FrontendMapper;
import com.smartstudyhub.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FrontendMapper frontendMapper;
    private final AccessControlService accessControlService;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpSession session) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        Role role = request.getRole() == null ? Role.STUDENT : request.getRole();

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword())
                .role(role)
                .avatar(request.getAvatar())
                .bio(request.getBio())
                .phone(request.getPhone())
                .location(request.getLocation())
                .build();

        User savedUser = userRepository.save(user);
        accessControlService.storeAuthenticatedUser(session, savedUser);

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful")
                .user(frontendMapper.toUserResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        accessControlService.storeAuthenticatedUser(session, user);

        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .user(frontendMapper.toUserResponse(user))
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(HttpSession session) {
        return frontendMapper.toUserResponse(accessControlService.getAuthenticatedUser(session));
    }

    public ApiMessageResponse logout(HttpSession session) {
        accessControlService.clearAuthenticatedUser(session);
        return ApiMessageResponse.builder()
                .message("Logout successful")
                .build();
    }
}
