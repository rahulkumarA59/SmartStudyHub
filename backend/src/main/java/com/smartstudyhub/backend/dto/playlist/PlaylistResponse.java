package com.smartstudyhub.backend.dto.playlist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PlaylistResponse {

    private Long id;
    private Long courseId;
    private String title;
    private String youtubeUrl;
    private String level;
    private String duration;
    private Integer order;
    private boolean completed;
}
