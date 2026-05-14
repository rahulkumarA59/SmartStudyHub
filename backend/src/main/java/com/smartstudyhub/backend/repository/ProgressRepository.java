package com.smartstudyhub.backend.repository;

import com.smartstudyhub.backend.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByUserIdAndPlaylistId(Long userId, Long playlistId);

    List<Progress> findByUserIdAndPlaylistCourseId(Long userId, Long courseId);

    @Query("""
            select p.playlist.id
            from Progress p
            where p.user.id = :userId
              and p.completed = true
            """)
    List<Long> findCompletedPlaylistIdsByUserId(@Param("userId") Long userId);
}
