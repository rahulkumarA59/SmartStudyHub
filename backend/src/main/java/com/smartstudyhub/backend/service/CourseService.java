package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.course.CourseRequest;
import com.smartstudyhub.backend.dto.course.CourseResponse;
import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.DifficultyLevel;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.BadRequestException;
import com.smartstudyhub.backend.exception.NotFoundException;
import com.smartstudyhub.backend.mapper.FrontendMapper;
import com.smartstudyhub.backend.repository.CourseRepository;
import com.smartstudyhub.backend.repository.PlaylistRepository;
import com.smartstudyhub.backend.repository.ProgressRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final PlaylistRepository playlistRepository;
    private final ProgressRepository progressRepository;
    private final AccessControlService accessControlService;
    private final FrontendMapper frontendMapper;

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(Long userId) {
        Set<Long> completedPlaylistIds = getCompletedPlaylistIds(userId);

        return courseRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(Course::getId, course -> course, (left, right) -> left, LinkedHashMap::new))
                .values().stream()
                .map(course -> buildCourseResponse(course, completedPlaylistIds))
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long courseId, Long userId) {
        Course course = getCourseEntity(courseId);
        return buildCourseResponse(course, getCompletedPlaylistIds(userId));
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request, HttpSession session) {
        User actor = accessControlService.resolveActor(firstNonNull(request.getRequesterId(), request.getTeacherId()), session);

        if (actor.getRole() == Role.TEACHER && request.getTeacherId() != null && !actor.getId().equals(request.getTeacherId())) {
            throw new BadRequestException("Teachers can only create courses for themselves");
        }

        if (actor.getRole() != Role.TEACHER && actor.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only teachers or admins can create courses");
        }

        User teacher = actor.getRole() == Role.ADMIN
                ? accessControlService.getUserOrThrow(requiredTeacherId(request))
                : actor;

        if (teacher.getRole() != Role.TEACHER) {
            throw new BadRequestException("teacherId must belong to a teacher account");
        }

        Course course = Course.builder()
                .name(requiredText(request.getName(), "Course name is required"))
                .description(requiredText(request.getDescription(), "Course description is required"))
                .teacher(teacher)
                .level(DifficultyLevel.fromValue(request.getLevel()))
                .category(trimToNull(request.getCategory()))
                .duration(trimToNull(request.getDuration()))
                .featured(request.getFeatured() != null ? request.getFeatured() : Boolean.FALSE)
                .rating(request.getRating() != null ? request.getRating() : 0.0)
                .students(0)
                .thumbnail(trimToNull(request.getThumbnail()))
                .build();

        Course savedCourse = courseRepository.save(course);
        return buildCourseResponse(savedCourse, Collections.emptySet());
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseRequest request, HttpSession session) {
        Course course = getCourseEntity(courseId);
        User actor = accessControlService.resolveActor(firstNonNull(request.getRequesterId(), request.getTeacherId()), session);
        accessControlService.requireCourseManager(actor, course);

        if (request.getName() != null) {
            course.setName(requiredText(request.getName(), "Course name is required"));
        }
        if (request.getDescription() != null) {
            course.setDescription(requiredText(request.getDescription(), "Course description is required"));
        }

        if (request.getLevel() != null) {
            course.setLevel(DifficultyLevel.fromValue(request.getLevel()));
        }
        if (request.getCategory() != null) {
            course.setCategory(trimToNull(request.getCategory()));
        }
        if (request.getDuration() != null) {
            course.setDuration(trimToNull(request.getDuration()));
        }
        if (request.getFeatured() != null) {
            course.setFeatured(request.getFeatured());
        }
        if (request.getRating() != null) {
            course.setRating(request.getRating());
        }
        if (request.getThumbnail() != null) {
            course.setThumbnail(trimToNull(request.getThumbnail()));
        }

        return buildCourseResponse(courseRepository.save(course), Collections.emptySet());
    }

    @Transactional
    public void deleteCourse(Long courseId, Long requesterId, HttpSession session) {
        Course course = getCourseEntity(courseId);
        User actor = accessControlService.resolveActor(requesterId, session);
        accessControlService.requireCourseManager(actor, course);
        courseRepository.delete(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> searchCourses(String keyword, Long userId) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllCourses(userId);
        }

        Set<Long> completedPlaylistIds = getCompletedPlaylistIds(userId);

        return courseRepository.search(keyword.trim()).stream()
                .map(course -> buildCourseResponse(course, completedPlaylistIds))
                .toList();
    }

    @Transactional
    public void incrementStudentCount(Course course) {
        int currentCount = course.getStudents() == null ? 0 : course.getStudents();
        course.setStudents(currentCount + 1);
        courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public Course getCourseEntity(Long courseId) {
        return courseRepository.findDetailedById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + courseId));
    }

    @Transactional(readOnly = true)
    public CourseResponse buildCourseResponse(Course course, Long userId) {
        return buildCourseResponse(course, getCompletedPlaylistIds(userId));
    }

    @Transactional(readOnly = true)
    public CourseResponse buildCourseResponse(Course course, Set<Long> completedPlaylistIds) {
        List<Playlist> playlists = playlistRepository.findByCourseIdOrderByOrderIndexAscIdAsc(course.getId());
        Set<Long> safeCompletedIds = completedPlaylistIds == null ? Collections.emptySet() : new LinkedHashSet<>(completedPlaylistIds);
        return frontendMapper.toCourseResponse(course, playlists, safeCompletedIds);
    }

    @Transactional(readOnly = true)
    public Set<Long> getCompletedPlaylistIds(Long userId) {
        if (userId == null) {
            return Collections.emptySet();
        }

        accessControlService.getUserOrThrow(userId);
        return new LinkedHashSet<>(progressRepository.findCompletedPlaylistIdsByUserId(userId));
    }

    private Long requiredTeacherId(CourseRequest request) {
        Long teacherId = request.getTeacherId();
        if (teacherId == null) {
            throw new BadRequestException("teacherId is required when an admin creates a course");
        }
        return teacherId;
    }

    private Long firstNonNull(Long primary, Long secondary) {
        return primary != null ? primary : secondary;
    }

    private String requiredText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException(message);
        }
        return value.trim();
    }

    private String trimToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
