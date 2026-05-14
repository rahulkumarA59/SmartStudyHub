package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.common.ApiMessageResponse;
import com.smartstudyhub.backend.dto.course.CourseRequest;
import com.smartstudyhub.backend.dto.course.CourseResponse;
import com.smartstudyhub.backend.service.CourseService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public List<CourseResponse> getAllCourses(@RequestParam(required = false) Long userId) {
        return courseService.getAllCourses(userId);
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        return courseService.getCourseById(id, userId);
    }

    @PostMapping
    public CourseResponse createCourse(@Valid @RequestBody CourseRequest request, HttpSession session) {
        return courseService.createCourse(request, session);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request, HttpSession session) {
        return courseService.updateCourse(id, request, session);
    }

    @DeleteMapping("/{id}")
    public ApiMessageResponse deleteCourse(@PathVariable Long id,
                                           @RequestParam(required = false) Long requesterId,
                                           HttpSession session) {
        courseService.deleteCourse(id, requesterId, session);
        return ApiMessageResponse.builder()
                .message("Course deleted successfully")
                .build();
    }

    @GetMapping("/search")
    public List<CourseResponse> searchCourses(@RequestParam String keyword,
                                              @RequestParam(required = false) Long userId) {
        return courseService.searchCourses(keyword, userId);
    }
}
