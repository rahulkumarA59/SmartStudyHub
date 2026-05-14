package com.smartstudyhub.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartstudyhub.backend.dto.auth.LoginRequest;
import com.smartstudyhub.backend.dto.progress.ProgressUpdateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
@Transactional
class BackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void contextLoads() {
	}

	@Test
	void loginReturnsFrontendFriendlyUserPayload() throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail("student@smartstudyhub.com");
		request.setPassword("student123");

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.user.id").value(1))
				.andExpect(jsonPath("$.user.name").value("Rahul Sharma"))
				.andExpect(jsonPath("$.user.role").value("STUDENT"))
				.andExpect(jsonPath("$.user.password").doesNotExist());
	}

	@Test
	void currentUserEndpointReturnsSessionUser() throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail("student@smartstudyhub.com");
		request.setPassword("student123");

		MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andReturn()
				.getRequest()
				.getSession(false);

		mockMvc.perform(get("/api/auth/me").session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.email").value("student@smartstudyhub.com"))
				.andExpect(jsonPath("$.role").value("STUDENT"));
	}

	@Test
	void courseDetailIncludesTeacherPlaylistsAndProgress() throws Exception {
		mockMvc.perform(get("/api/courses/1").param("userId", "1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.teacherName").value("Prof. James Miller"))
				.andExpect(jsonPath("$.instructor").value("Prof. James Miller"))
				.andExpect(jsonPath("$.level").value("Intermediate"))
				.andExpect(jsonPath("$.playlists.length()").value(5))
				.andExpect(jsonPath("$.playlists[0].title").value("Introduction to DSA"))
				.andExpect(jsonPath("$.playlists[0].completed").value(true))
				.andExpect(jsonPath("$.progress").value(40));
	}

	@Test
	void progressCompletionUpdatesCourseProgressResponse() throws Exception {
		ProgressUpdateRequest request = new ProgressUpdateRequest();
		request.setUserId(1L);
		request.setRequesterId(1L);
		request.setPlaylistId(12L);
		request.setCompleted(true);

		mockMvc.perform(post("/api/progress/complete")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.userId").value(1))
				.andExpect(jsonPath("$.courseId").value(4))
				.andExpect(jsonPath("$.completedVideos").value(1))
				.andExpect(jsonPath("$.totalVideos").value(4))
				.andExpect(jsonPath("$.progress").value(25));
	}

}
