package com.smartstudyhub.backend.dto.course;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequest {

    private String name;

    private String description;

    private Long teacherId;
    private Long requesterId;
    private String level;
    private String category;
    private String duration;
    private Boolean featured;
    private Double rating;
    private String thumbnail;
}
