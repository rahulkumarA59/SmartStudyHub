package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.course.CourseResponse;
import com.smartstudyhub.backend.service.EnrollmentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enroll/{courseId}")
    public CourseResponse enroll(@PathVariable Long courseId,
                                 @RequestParam(required = false) Long userId,
                                 @RequestParam(required = false) Long requesterId,
                                 HttpSession session) {
        return enrollmentService.enroll(courseId, userId, requesterId, session);
    }

    @GetMapping("/my-courses/{userId}")
    public List<CourseResponse> getMyCourses(@PathVariable Long userId) {
        return enrollmentService.getMyCourses(userId);
    }
}
