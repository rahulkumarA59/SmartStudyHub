package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.dto.playlist.PlaylistRequest;
import com.smartstudyhub.backend.dto.playlist.PlaylistResponse;
import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.DifficultyLevel;
import com.smartstudyhub.backend.exception.BadRequestException;
import com.smartstudyhub.backend.exception.NotFoundException;
import com.smartstudyhub.backend.mapper.FrontendMapper;
import com.smartstudyhub.backend.repository.PlaylistRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final CourseService courseService;
    private final AccessControlService accessControlService;
    private final FrontendMapper frontendMapper;

    @Transactional(readOnly = true)
    public List<PlaylistResponse> getPlaylistsByCourseId(Long courseId, Long userId) {
        courseService.getCourseEntity(courseId);
        Set<Long> completedPlaylistIds = courseService.getCompletedPlaylistIds(userId);
        return playlistRepository.findByCourseIdOrderByOrderIndexAscIdAsc(courseId).stream()
                .map(playlist -> frontendMapper.toPlaylistResponse(playlist, completedPlaylistIds))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Playlist> getPlaylistEntitiesByCourseId(Long courseId) {
        courseService.getCourseEntity(courseId);
        return playlistRepository.findByCourseIdOrderByOrderIndexAscIdAsc(courseId);
    }

    @Transactional
    public PlaylistResponse createPlaylist(PlaylistRequest request, HttpSession session) {
        Course course = courseService.getCourseEntity(request.getCourseId());
        User actor = accessControlService.resolveActor(request.getRequesterId(), session);
        accessControlService.requireCourseManager(actor, course);

        Playlist playlist = Playlist.builder()
                .course(course)
                .title(clean(request.getTitle(), "Title is required"))
                .youtubeUrl(clean(request.getYoutubeUrl(), "youtubeUrl is required"))
                .level(DifficultyLevel.fromValue(request.getLevel()))
                .duration(trimToNull(request.getDuration()))
                .orderIndex(resolveOrder(request.getOrder(), course.getId()))
                .build();

        return frontendMapper.toPlaylistResponse(playlistRepository.save(playlist), Set.of());
    }

    @Transactional
    public PlaylistResponse updatePlaylist(Long playlistId, PlaylistRequest request, HttpSession session) {
        Playlist playlist = getPlaylistEntity(playlistId);
        User actor = accessControlService.resolveActor(request.getRequesterId(), session);
        accessControlService.requirePlaylistManager(actor, playlist);

        playlist.setTitle(clean(request.getTitle(), "Title is required"));
        playlist.setYoutubeUrl(clean(request.getYoutubeUrl(), "youtubeUrl is required"));

        if (request.getLevel() != null) {
            playlist.setLevel(DifficultyLevel.fromValue(request.getLevel()));
        }
        if (request.getDuration() != null) {
            playlist.setDuration(trimToNull(request.getDuration()));
        }
        if (request.getOrder() != null) {
            playlist.setOrderIndex(request.getOrder());
        }

        return frontendMapper.toPlaylistResponse(playlistRepository.save(playlist), Set.of());
    }

    @Transactional
    public void deletePlaylist(Long playlistId, Long requesterId, HttpSession session) {
        Playlist playlist = getPlaylistEntity(playlistId);
        User actor = accessControlService.resolveActor(requesterId, session);
        accessControlService.requirePlaylistManager(actor, playlist);
        playlistRepository.delete(playlist);
    }

    @Transactional(readOnly = true)
    public Playlist getPlaylistEntity(Long playlistId) {
        return playlistRepository.findById(playlistId)
                .orElseThrow(() -> new NotFoundException("Playlist not found with id: " + playlistId));
    }

    private Integer resolveOrder(Integer requestedOrder, Long courseId) {
        if (requestedOrder != null && requestedOrder > 0) {
            return requestedOrder;
        }

        return playlistRepository.findTopByCourseIdOrderByOrderIndexDesc(courseId)
                .map(existingPlaylist -> (existingPlaylist.getOrderIndex() == null ? 0 : existingPlaylist.getOrderIndex()) + 1)
                .orElse(1);
    }

    private String clean(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException(message);
        }
        return value.trim();
    }

    private String trimToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
