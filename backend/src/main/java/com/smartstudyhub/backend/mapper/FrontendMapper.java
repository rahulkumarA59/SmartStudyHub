package com.smartstudyhub.backend.mapper;

import com.smartstudyhub.backend.dto.course.CourseResponse;
import com.smartstudyhub.backend.dto.playlist.PlaylistResponse;
import com.smartstudyhub.backend.dto.progress.CourseProgressResponse;
import com.smartstudyhub.backend.dto.user.UserResponse;
import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Component
public class FrontendMapper {

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .joinedDate(user.getJoinedDate())
                .bio(user.getBio())
                .phone(user.getPhone())
                .location(user.getLocation())
                .build();
    }

    public PlaylistResponse toPlaylistResponse(Playlist playlist, Set<Long> completedPlaylistIds) {
        Set<Long> safeCompletedIds = completedPlaylistIds == null ? Collections.emptySet() : completedPlaylistIds;

        return PlaylistResponse.builder()
                .id(playlist.getId())
                .courseId(playlist.getCourse().getId())
                .title(playlist.getTitle())
                .youtubeUrl(playlist.getYoutubeUrl())
                .level(playlist.getLevel().toFrontendValue())
                .duration(playlist.getDuration())
                .order(playlist.getOrderIndex())
                .completed(safeCompletedIds.contains(playlist.getId()))
                .build();
    }

    public CourseResponse toCourseResponse(Course course, List<Playlist> playlists, Set<Long> completedPlaylistIds) {
        List<PlaylistResponse> playlistResponses = playlists.stream()
                .map(playlist -> toPlaylistResponse(playlist, completedPlaylistIds))
                .toList();

        int totalVideos = playlistResponses.size();
        int completedVideos = (int) playlistResponses.stream().filter(PlaylistResponse::isCompleted).count();
        int progress = totalVideos == 0 ? 0 : Math.round((completedVideos * 100f) / totalVideos);

        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .teacherId(course.getTeacher().getId())
                .teacherName(course.getTeacher().getName())
                .instructorId(course.getTeacher().getId())
                .instructor(course.getTeacher().getName())
                .level(course.getLevel().toFrontendValue())
                .category(course.getCategory())
                .duration(course.getDuration())
                .featured(Boolean.TRUE.equals(course.getFeatured()))
                .rating(course.getRating() == null ? 0.0 : course.getRating())
                .students(course.getStudents() == null ? 0 : course.getStudents())
                .totalVideos(totalVideos)
                .thumbnail(course.getThumbnail())
                .playlists(playlistResponses)
                .progress(progress)
                .build();
    }

    public CourseProgressResponse toCourseProgressResponse(Long userId, Course course, List<Playlist> playlists, Set<Long> completedPlaylistIds) {
        List<PlaylistResponse> playlistResponses = playlists.stream()
                .map(playlist -> toPlaylistResponse(playlist, completedPlaylistIds))
                .toList();

        int totalVideos = playlistResponses.size();
        int completedVideos = (int) playlistResponses.stream().filter(PlaylistResponse::isCompleted).count();
        int progress = totalVideos == 0 ? 0 : Math.round((completedVideos * 100f) / totalVideos);

        return CourseProgressResponse.builder()
                .userId(userId)
                .courseId(course.getId())
                .completedVideos(completedVideos)
                .totalVideos(totalVideos)
                .progress(progress)
                .playlists(playlistResponses)
                .build();
    }
}
