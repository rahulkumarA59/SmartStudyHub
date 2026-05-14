package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.user.UserResponse;
import com.smartstudyhub.backend.dto.user.UserUpdateRequest;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.BadRequestException;
import com.smartstudyhub.backend.exception.ConflictException;
import com.smartstudyhub.backend.mapper.FrontendMapper;
import com.smartstudyhub.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AccessControlService accessControlService;
    private final FrontendMapper frontendMapper;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(HttpSession session) {
        User actor = accessControlService.getAuthenticatedUser(session);
        accessControlService.requireRole(actor, Role.ADMIN);

        return userRepository.findAll().stream()
                .map(frontendMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(Long userId, UserUpdateRequest request, HttpSession session) {
        User actor = accessControlService.getAuthenticatedUser(session);
        User targetUser = accessControlService.getUserOrThrow(userId);

        boolean isAdmin = actor.getRole() == Role.ADMIN;
        if (!isAdmin) {
            accessControlService.requireSameUserOrAdmin(actor, targetUser);
        }

        if (request.getRole() != null) {
            if (!isAdmin) {
                throw new BadRequestException("Only admins can change user roles");
            }
            targetUser.setRole(request.getRole());
        }

        if (request.getName() != null) {
            targetUser.setName(requiredText(request.getName(), "Name is required"));
        }
        if (request.getEmail() != null) {
            String normalizedEmail = requiredText(request.getEmail(), "Email is required").toLowerCase();
            if (!normalizedEmail.equalsIgnoreCase(targetUser.getEmail()) && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new ConflictException("Email already registered");
            }
            targetUser.setEmail(normalizedEmail);
        }
        if (request.getAvatar() != null) {
            targetUser.setAvatar(trimToNull(request.getAvatar()));
        }
        if (request.getBio() != null) {
            targetUser.setBio(trimToNull(request.getBio()));
        }
        if (request.getPhone() != null) {
            targetUser.setPhone(trimToNull(request.getPhone()));
        }
        if (request.getLocation() != null) {
            targetUser.setLocation(trimToNull(request.getLocation()));
        }

        return frontendMapper.toUserResponse(userRepository.save(targetUser));
    }

    @Transactional
    public void deleteUser(Long userId, HttpSession session) {
        User actor = accessControlService.getAuthenticatedUser(session);
        accessControlService.requireRole(actor, Role.ADMIN);

        if (actor.getId().equals(userId)) {
            throw new BadRequestException("Admins cannot delete their own account");
        }

        userRepository.delete(accessControlService.getUserOrThrow(userId));
    }

    private String requiredText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException(message);
        }
        return value.trim();
    }

    private String trimToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
