package com.smartstudyhub.backend.repository;

import com.smartstudyhub.backend.entity.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Override
    @EntityGraph(attributePaths = {"teacher", "playlists"})
    List<Course> findAll();

    @EntityGraph(attributePaths = {"teacher", "playlists"})
    List<Course> findByTeacherId(Long teacherId);

    @EntityGraph(attributePaths = {"teacher", "playlists"})
    Optional<Course> findDetailedById(Long id);

    @EntityGraph(attributePaths = {"teacher", "playlists"})
    @Query("""
            select distinct c
            from Course c
            left join c.teacher t
            left join c.playlists p
            where lower(c.name) like lower(concat('%', :keyword, '%'))
               or lower(c.description) like lower(concat('%', :keyword, '%'))
               or lower(t.name) like lower(concat('%', :keyword, '%'))
            """)
    List<Course> search(@Param("keyword") String keyword);
}
