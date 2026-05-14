package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.common.ApiMessageResponse;
import com.smartstudyhub.backend.dto.user.UserResponse;
import com.smartstudyhub.backend.dto.user.UserUpdateRequest;
import com.smartstudyhub.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers(HttpSession session) {
        return userService.getAllUsers(session);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,
                                   @RequestBody UserUpdateRequest request,
                                   HttpSession session) {
        return userService.updateUser(id, request, session);
    }

    @DeleteMapping("/{id}")
    public ApiMessageResponse deleteUser(@PathVariable Long id, HttpSession session) {
        userService.deleteUser(id, session);
        return ApiMessageResponse.builder()
                .message("User deleted successfully")
                .build();
    }
}
