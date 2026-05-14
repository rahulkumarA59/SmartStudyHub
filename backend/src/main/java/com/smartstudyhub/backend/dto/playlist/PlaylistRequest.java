package com.smartstudyhub.backend.dto.playlist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistRequest {

    @NotNull
    private Long courseId;

    private Long requesterId;

    @NotBlank
    private String title;

    @NotBlank
    private String youtubeUrl;

    private String level;
    private String duration;
    private Integer order;
}
