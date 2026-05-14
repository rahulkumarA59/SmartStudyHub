package com.smartstudyhub.backend.dto.progress;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgressUpdateRequest {

    @NotNull
    private Long userId;

    private Long requesterId;

    @NotNull
    private Long playlistId;

    private Boolean completed = Boolean.TRUE;
}
