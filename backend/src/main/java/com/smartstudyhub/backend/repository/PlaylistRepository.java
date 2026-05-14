package com.smartstudyhub.backend.repository;

import com.smartstudyhub.backend.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByCourseIdOrderByOrderIndexAscIdAsc(Long courseId);

    Optional<Playlist> findTopByCourseIdOrderByOrderIndexDesc(Long courseId);
}
