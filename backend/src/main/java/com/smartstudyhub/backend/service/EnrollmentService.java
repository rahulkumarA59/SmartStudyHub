package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.course.CourseResponse;
import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Enrollment;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.ConflictException;
import com.smartstudyhub.backend.repository.EnrollmentRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final AccessControlService accessControlService;

    @Transactional
    public CourseResponse enroll(Long courseId, Long userId, Long requesterId, HttpSession session) {
        User actor = accessControlService.resolveActor(requesterId != null ? requesterId : userId, session);
        User targetUser = userId != null ? accessControlService.getUserOrThrow(userId) : actor;
        accessControlService.requireSameUserOrAdmin(actor, targetUser);

        if (targetUser.getRole() != Role.STUDENT) {
            throw new ConflictException("Only students can enroll in courses");
        }

        Course course = courseService.getCourseEntity(courseId);

        if (enrollmentRepository.existsByUserIdAndCourseId(targetUser.getId(), courseId)) {
            throw new ConflictException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .user(targetUser)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);
        courseService.incrementStudentCount(course);

        return courseService.buildCourseResponse(course, targetUser.getId());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(Long userId) {
        accessControlService.getUserOrThrow(userId);

        return enrollmentRepository.findByUserId(userId).stream()
                .map(Enrollment::getCourse)
                .distinct()
                .map(course -> courseService.buildCourseResponse(course, userId))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}
