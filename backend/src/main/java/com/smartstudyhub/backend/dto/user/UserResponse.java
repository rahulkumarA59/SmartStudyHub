package com.smartstudyhub.backend.dto.user;

import com.smartstudyhub.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
    private LocalDate joinedDate;
    private String bio;
    private String phone;
    private String location;
}
