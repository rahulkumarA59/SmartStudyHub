package com.smartstudyhub.backend.repository;

import com.smartstudyhub.backend.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    long countByCourseId(Long courseId);

    List<Enrollment> findByUserId(Long userId);

    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
}
