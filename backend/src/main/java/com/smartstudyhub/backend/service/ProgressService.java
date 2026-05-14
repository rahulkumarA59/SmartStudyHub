package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.progress.CourseProgressResponse;
import com.smartstudyhub.backend.dto.progress.ProgressUpdateRequest;
import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.Progress;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.ForbiddenException;
import com.smartstudyhub.backend.mapper.FrontendMapper;
import com.smartstudyhub.backend.repository.ProgressRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final PlaylistService playlistService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final AccessControlService accessControlService;
    private final FrontendMapper frontendMapper;

    @Transactional
    public CourseProgressResponse markProgress(ProgressUpdateRequest request, HttpSession session) {
        User actor = accessControlService.resolveActor(
                request.getRequesterId() != null ? request.getRequesterId() : request.getUserId(),
                session
        );
        User targetUser = accessControlService.getUserOrThrow(request.getUserId());
        accessControlService.requireSameUserOrAdmin(actor, targetUser);

        Playlist playlist = playlistService.getPlaylistEntity(request.getPlaylistId());
        Course course = playlist.getCourse();

        if (actor.getRole() != Role.ADMIN && !enrollmentService.isEnrolled(targetUser.getId(), course.getId())) {
            throw new ForbiddenException("Student must be enrolled before tracking progress");
        }

        Progress progress = progressRepository.findByUserIdAndPlaylistId(targetUser.getId(), playlist.getId())
                .orElseGet(() -> Progress.builder()
                        .user(targetUser)
                        .playlist(playlist)
                        .build());

        progress.setCompleted(Boolean.TRUE.equals(request.getCompleted()));
        progressRepository.save(progress);

        return getCourseProgress(targetUser.getId(), course.getId());
    }

    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(Long userId, Long courseId) {
        accessControlService.getUserOrThrow(userId);
        Course course = courseService.getCourseEntity(courseId);
        List<Playlist> playlists = playlistService.getPlaylistEntitiesByCourseId(courseId);

        Set<Long> completedPlaylistIds = new LinkedHashSet<>(progressRepository.findByUserIdAndPlaylistCourseId(userId, courseId).stream()
                .filter(Progress::isCompleted)
                .map(progress -> progress.getPlaylist().getId())
                .toList());

        return frontendMapper.toCourseProgressResponse(userId, course, playlists, completedPlaylistIds);
    }
}
