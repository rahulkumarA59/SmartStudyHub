package com.smartstudyhub.backend.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ApiMessageResponse {

    private String message;
}
