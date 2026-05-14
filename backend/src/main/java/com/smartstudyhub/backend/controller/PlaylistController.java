package com.smartstudyhub.backend.controller;

import com.smartstudyhub.backend.dto.common.ApiMessageResponse;
import com.smartstudyhub.backend.dto.playlist.PlaylistRequest;
import com.smartstudyhub.backend.dto.playlist.PlaylistResponse;
import com.smartstudyhub.backend.service.PlaylistService;
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
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @GetMapping("/{courseId}")
    public List<PlaylistResponse> getPlaylists(@PathVariable Long courseId,
                                               @RequestParam(required = false) Long userId) {
        return playlistService.getPlaylistsByCourseId(courseId, userId);
    }

    @PostMapping
    public PlaylistResponse createPlaylist(@Valid @RequestBody PlaylistRequest request, HttpSession session) {
        return playlistService.createPlaylist(request, session);
    }

    @PutMapping("/{playlistId}")
    public PlaylistResponse updatePlaylist(@PathVariable Long playlistId,
                                           @Valid @RequestBody PlaylistRequest request,
                                           HttpSession session) {
        return playlistService.updatePlaylist(playlistId, request, session);
    }

    @DeleteMapping("/{playlistId}")
    public ApiMessageResponse deletePlaylist(@PathVariable Long playlistId,
                                             @RequestParam(required = false) Long requesterId,
                                             HttpSession session) {
        playlistService.deletePlaylist(playlistId, requesterId, session);
        return ApiMessageResponse.builder()
                .message("Playlist deleted successfully")
                .build();
    }
}
