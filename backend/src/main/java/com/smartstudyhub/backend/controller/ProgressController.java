package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.progress.CourseProgressResponse;
import com.smartstudyhub.backend.dto.progress.ProgressUpdateRequest;
import com.smartstudyhub.backend.service.ProgressService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/complete")
    public CourseProgressResponse completeProgress(@Valid @RequestBody ProgressUpdateRequest request,
                                                   HttpSession session) {
        return progressService.markProgress(request, session);
    }

    @GetMapping("/{userId}/{courseId}")
    public CourseProgressResponse getCourseProgress(@PathVariable Long userId,
                                                    @PathVariable Long courseId) {
        return progressService.getCourseProgress(userId, courseId);
    }
}
