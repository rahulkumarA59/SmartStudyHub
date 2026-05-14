package com.smartstudyhub.backend.service;

import com.smartstudyhub.backend.entity.Course;
import com.smartstudyhub.backend.entity.Playlist;
import com.smartstudyhub.backend.entity.User;
import com.smartstudyhub.backend.enums.Role;
import com.smartstudyhub.backend.exception.ForbiddenException;
import com.smartstudyhub.backend.exception.NotFoundException;
import com.smartstudyhub.backend.exception.UnauthorizedException;
import com.smartstudyhub.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    public static final String SESSION_USER_ID = "smartstudyhub_user_id";

    private final UserRepository userRepository;

    public User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    }

    public User resolveActor(Long explicitUserId, HttpSession session) {
        Long sessionUserId = session == null ? null : (Long) session.getAttribute(SESSION_USER_ID);
        Long actorId = explicitUserId != null ? explicitUserId : sessionUserId;

        if (actorId == null) {
            throw new UnauthorizedException("Login required or requesterId must be provided");
        }

        return getUserOrThrow(actorId);
    }

    public void storeAuthenticatedUser(HttpSession session, User user) {
        if (session != null) {
            session.setAttribute(SESSION_USER_ID, user.getId());
        }
    }

    public User getAuthenticatedUser(HttpSession session) {
        if (session == null) {
            throw new UnauthorizedException("Login required");
        }

        Long sessionUserId = (Long) session.getAttribute(SESSION_USER_ID);
        if (sessionUserId == null) {
            throw new UnauthorizedException("Login required");
        }

        return getUserOrThrow(sessionUserId);
    }

    public void clearAuthenticatedUser(HttpSession session) {
        if (session != null) {
            session.removeAttribute(SESSION_USER_ID);
            session.invalidate();
        }
    }

    public void requireRole(User user, Role... allowedRoles) {
        boolean allowed = Arrays.stream(allowedRoles).anyMatch(role -> role == user.getRole());
        if (!allowed) {
            throw new ForbiddenException("User does not have permission for this action");
        }
    }

    public void requireSameUserOrAdmin(User actor, User targetUser) {
        if (actor.getRole() == Role.ADMIN || actor.getId().equals(targetUser.getId())) {
            return;
        }
        throw new ForbiddenException("You can only perform this action for your own account");
    }

    public void requireCourseManager(User actor, Course course) {
        if (actor.getRole() == Role.ADMIN) {
            return;
        }

        if (actor.getRole() == Role.TEACHER && course.getTeacher().getId().equals(actor.getId())) {
            return;
        }

        throw new ForbiddenException("Only the owning teacher or an admin can manage this course");
    }

    public void requirePlaylistManager(User actor, Playlist playlist) {
        requireCourseManager(actor, playlist.getCourse());
    }
}
