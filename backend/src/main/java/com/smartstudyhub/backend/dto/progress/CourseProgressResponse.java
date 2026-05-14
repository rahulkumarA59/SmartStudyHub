package com.smartstudyhub.backend.dto.progress;

import com.smartstudyhub.backend.dto.playlist.PlaylistResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class CourseProgressResponse {

    private Long userId;
    private Long courseId;
    private int completedVideos;
    private int totalVideos;
    private int progress;
    private List<PlaylistResponse> playlists;
}
