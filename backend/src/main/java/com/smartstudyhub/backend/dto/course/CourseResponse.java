package com.smartstudyhub.backend.dto.course;

import com.smartstudyhub.backend.dto.playlist.PlaylistResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class CourseResponse {

    private Long id;
    private String name;
    private String description;
    private Long teacherId;
    private String teacherName;
    private Long instructorId;
    private String instructor;
    private String level;
    private String category;
    private String duration;
    private Boolean featured;
    private Double rating;
    private Integer students;
    private Integer totalVideos;
    private String thumbnail;
    private List<PlaylistResponse> playlists;
    private Integer progress;
}
