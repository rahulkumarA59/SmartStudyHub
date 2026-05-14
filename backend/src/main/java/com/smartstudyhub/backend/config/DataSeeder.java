package com.smartstudyhub.backend.config;

import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Enrollment;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.Progress;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.DifficultyLevel;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.repository.CourseRepository;
import com.smartstudyhub.backend.repository.EnrollmentRepository;
import com.smartstudyhub.backend.repository.PlaylistRepository;
import com.smartstudyhub.backend.repository.ProgressRepository;
import com.smartstudyhub.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDemoData(UserRepository userRepository,
                                   CourseRepository courseRepository,
                                   PlaylistRepository playlistRepository,
                                   EnrollmentRepository enrollmentRepository,
                                   ProgressRepository progressRepository) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User studentRahul = userRepository.save(User.builder()
                    .name("Rahul Sharma")
                    .email("student@smartstudyhub.com")
                    .password("student123")
                    .role(Role.STUDENT)
                    .joinedDate(LocalDate.parse("2025-09-15"))
                    .bio("Passionate learner focused on full-stack development and data structures.")
                    .phone("+91 9876543210")
                    .location("Pune, India")
                    .build());

            User teacherJames = userRepository.save(User.builder()
                    .name("Prof. James Miller")
                    .email("teacher@smartstudyhub.com")
                    .password("teacher123")
                    .role(Role.TEACHER)
                    .joinedDate(LocalDate.parse("2024-06-01"))
                    .bio("Senior developer with 10+ years experience. Teaching Java, React, and DSA.")
                    .phone("+1 555-234-5678")
                    .location("San Francisco, USA")
                    .build());

            userRepository.save(User.builder()
                    .name("Admin User")
                    .email("admin@smartstudyhub.com")
                    .password("admin123")
                    .role(Role.ADMIN)
                    .joinedDate(LocalDate.parse("2024-01-01"))
                    .bio("Platform administrator.")
                    .phone("+1 555-000-0000")
                    .location("New York, USA")
                    .build());

            User teacherEmily = userRepository.save(User.builder()
                    .name("Emily Watson")
                    .email("emily@smartstudyhub.com")
                    .password("emily123")
                    .role(Role.TEACHER)
                    .joinedDate(LocalDate.parse("2025-01-10"))
                    .bio("Data Science educator and Python enthusiast.")
                    .phone("+44 7700 123456")
                    .location("London, UK")
                    .build());

            User studentPriya = userRepository.save(User.builder()
                    .name("Priya Patel")
                    .email("priya@smartstudyhub.com")
                    .password("priya123")
                    .role(Role.STUDENT)
                    .joinedDate(LocalDate.parse("2025-11-20"))
                    .bio("Computer Science student exploring databases and backend.")
                    .phone("+91 9123456789")
                    .location("Mumbai, India")
                    .build());

            Course dsa = courseRepository.save(course("Data Structures & Algorithms",
                    "Master DSA from scratch with comprehensive tutorials and practice problems.",
                    teacherJames, DifficultyLevel.INTERMEDIATE, "Computer Science", "24 hrs", true, 4.8, 1245));
            Course java = courseRepository.save(course("Java Programming",
                    "Complete Java course covering OOP, collections, multithreading, and advanced concepts.",
                    teacherJames, DifficultyLevel.BEGINNER, "Programming", "18 hrs", true, 4.7, 2340));
            Course dbms = courseRepository.save(course("Database Management System",
                    "SQL and DBMS concepts including normalization, transactions, indexing, and query optimization.",
                    teacherJames, DifficultyLevel.INTERMEDIATE, "Database", "15 hrs", false, 4.5, 890));
            Course react = courseRepository.save(course("React.js Masterclass",
                    "Build modern web applications with React, hooks, context, routing, and state management.",
                    teacherJames, DifficultyLevel.INTERMEDIATE, "Web Development", "20 hrs", true, 4.9, 1890));
            Course python = courseRepository.save(course("Python for Data Science",
                    "Learn Python with NumPy, Pandas, Matplotlib, and machine learning fundamentals.",
                    teacherEmily, DifficultyLevel.BEGINNER, "Data Science", "22 hrs", false, 4.6, 1560));

            Playlist dsa1 = playlistRepository.save(playlist(dsa, 1, "Introduction to DSA", "https://www.youtube.com/watch?v=8hly31xKli0", DifficultyLevel.BEGINNER, "45 min"));
            Playlist dsa2 = playlistRepository.save(playlist(dsa, 2, "Arrays and Strings", "https://www.youtube.com/watch?v=QJNwK2uJyGs", DifficultyLevel.BEGINNER, "1 hr 10 min"));
            playlistRepository.save(playlist(dsa, 3, "Linked Lists Deep Dive", "https://www.youtube.com/watch?v=Hj_rA0dhr2I", DifficultyLevel.INTERMEDIATE, "1 hr 30 min"));
            playlistRepository.save(playlist(dsa, 4, "Trees and Graphs", "https://www.youtube.com/watch?v=oSWTXtMglKE", DifficultyLevel.INTERMEDIATE, "2 hr"));
            playlistRepository.save(playlist(dsa, 5, "Dynamic Programming", "https://www.youtube.com/watch?v=oBt53YbR9Kk", DifficultyLevel.ADVANCED, "2 hr 15 min"));

            Playlist java1 = playlistRepository.save(playlist(java, 1, "Java Basics", "https://www.youtube.com/watch?v=eIrMbAQSU34", DifficultyLevel.BEGINNER, "1 hr 45 min"));
            Playlist java2 = playlistRepository.save(playlist(java, 2, "OOP Concepts", "https://www.youtube.com/watch?v=pTB0EiLXUC8", DifficultyLevel.INTERMEDIATE, "1 hr 20 min"));
            playlistRepository.save(playlist(java, 3, "Java Collections", "https://www.youtube.com/watch?v=rzA7UJ-hQn4", DifficultyLevel.ADVANCED, "1 hr 50 min"));

            Playlist dbms1 = playlistRepository.save(playlist(dbms, 1, "SQL Fundamentals", "https://www.youtube.com/watch?v=HXV3zeQKqGY", DifficultyLevel.BEGINNER, "2 hr"));
            playlistRepository.save(playlist(dbms, 2, "Joins and Subqueries", "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", DifficultyLevel.INTERMEDIATE, "1 hr 30 min"));
            playlistRepository.save(playlist(dbms, 3, "Database Design", "https://www.youtube.com/watch?v=ztHopE5Wnpc", DifficultyLevel.ADVANCED, "1 hr 45 min"));

            Playlist react1 = playlistRepository.save(playlist(react, 1, "React Fundamentals", "https://www.youtube.com/watch?v=Tn6-PIqc4UM", DifficultyLevel.BEGINNER, "2 hr"));
            playlistRepository.save(playlist(react, 2, "React Hooks Deep Dive", "https://www.youtube.com/watch?v=TNhaISOUy6Q", DifficultyLevel.INTERMEDIATE, "1 hr 45 min"));
            playlistRepository.save(playlist(react, 3, "React Router & Navigation", "https://www.youtube.com/watch?v=Ul3y1LXxzdU", DifficultyLevel.INTERMEDIATE, "1 hr 20 min"));
            playlistRepository.save(playlist(react, 4, "State Management Patterns", "https://www.youtube.com/watch?v=5LrDIWkK_Bc", DifficultyLevel.ADVANCED, "2 hr 10 min"));

            playlistRepository.save(playlist(python, 1, "Python Basics", "https://www.youtube.com/watch?v=kqtD5dpn9C8", DifficultyLevel.BEGINNER, "3 hr"));
            playlistRepository.save(playlist(python, 2, "NumPy & Pandas", "https://www.youtube.com/watch?v=vmEHCJofslg", DifficultyLevel.INTERMEDIATE, "2 hr 30 min"));
            playlistRepository.save(playlist(python, 3, "Data Visualization", "https://www.youtube.com/watch?v=UO98lJQ3QGI", DifficultyLevel.INTERMEDIATE, "1 hr 45 min"));

            enrollmentRepository.save(Enrollment.builder().user(studentRahul).course(dsa).build());
            enrollmentRepository.save(Enrollment.builder().user(studentRahul).course(java).build());
            enrollmentRepository.save(Enrollment.builder().user(studentRahul).course(react).build());
            enrollmentRepository.save(Enrollment.builder().user(studentPriya).course(dsa).build());
            enrollmentRepository.save(Enrollment.builder().user(studentPriya).course(dbms).build());
            enrollmentRepository.save(Enrollment.builder().user(studentPriya).course(python).build());

            progressRepository.save(Progress.builder().user(studentRahul).playlist(dsa1).completed(true).build());
            progressRepository.save(Progress.builder().user(studentRahul).playlist(dsa2).completed(true).build());
            progressRepository.save(Progress.builder().user(studentRahul).playlist(java1).completed(true).build());
            progressRepository.save(Progress.builder().user(studentRahul).playlist(java2).completed(true).build());
            progressRepository.save(Progress.builder().user(studentRahul).playlist(react1).completed(false).build());
            progressRepository.save(Progress.builder().user(studentPriya).playlist(dbms1).completed(true).build());
        };
    }

    private Course course(String name,
                          String description,
                          User teacher,
                          DifficultyLevel level,
                          String category,
                          String duration,
                          boolean featured,
                          double rating,
                          int students) {
        return Course.builder()
                .name(name)
                .description(description)
                .teacher(teacher)
                .level(level)
                .category(category)
                .duration(duration)
                .featured(featured)
                .rating(rating)
                .students(students)
                .build();
    }

    private Playlist playlist(Course course,
                              int order,
                              String title,
                              String youtubeUrl,
                              DifficultyLevel level,
                              String duration) {
        return Playlist.builder()
                .course(course)
                .orderIndex(order)
                .title(title)
                .youtubeUrl(youtubeUrl)
                .level(level)
                .duration(duration)
                .build();
    }
}
