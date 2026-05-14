package com.smartstudyhub.backend.dto.user;

import com.smartstudyhub.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    private String name;
    private String email;
    private Role role;
    private String avatar;
    private String bio;
    private String phone;
    private String location;
}
