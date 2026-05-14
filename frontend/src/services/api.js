import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') =>
  error?.response?.data?.message || error?.message || fallback

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeLevel = (level) => {
  const formattedLevel = `${level ?? ''}`.trim().toLowerCase()

  if (formattedLevel === 'intermediate') return 'Intermediate'
  if (formattedLevel === 'advanced') return 'Advanced'
  return 'Beginner'
}

const normalizeUser = (user = {}) => ({
  ...user,
  id: toNumber(user.id, null),
  name: user.name ?? '',
  email: user.email ?? '',
  role: user.role ?? 'STUDENT',
  avatar: user.avatar ?? null,
  joinedDate: user.joinedDate ?? null,
  bio: user.bio ?? '',
  phone: user.phone ?? '',
  location: user.location ?? '',
})

const normalizePlaylist = (playlist = {}) => {
  const rawCourseId = playlist.courseId ?? playlist.course?.id

  return {
    ...playlist,
    id: toNumber(playlist.id, null),
    courseId: rawCourseId == null ? null : toNumber(rawCourseId, null),
    title: playlist.title ?? '',
    youtubeUrl: playlist.youtubeUrl ?? playlist.youtubeURL ?? playlist.url ?? '',
    level: normalizeLevel(playlist.level),
    duration: playlist.duration ?? '',
    order: toNumber(playlist.order ?? playlist.orderIndex, 0),
    completed: Boolean(playlist.completed),
  }
}

const normalizeCourse = (course = {}) => {
  const playlists = Array.isArray(course.playlists)
    ? course.playlists.map(normalizePlaylist)
    : []

  return {
    ...course,
    id: toNumber(course.id, null),
    teacherId: toNumber(course.teacherId, null),
    instructorId: toNumber(course.instructorId ?? course.teacherId, null),
    name: course.name ?? '',
    description: course.description ?? '',
    teacherName: course.teacherName ?? course.instructor ?? '',
    instructor: course.instructor ?? course.teacherName ?? '',
    level: normalizeLevel(course.level),
    category: course.category ?? '',
    duration: course.duration ?? '',
    featured: Boolean(course.featured),
    rating: toNumber(course.rating, 0),
    students: toNumber(course.students, 0),
    totalVideos: toNumber(course.totalVideos, playlists.length),
    thumbnail: course.thumbnail ?? null,
    playlists,
    progress: toNumber(course.progress, 0),
  }
}

const normalizeProgress = (payload = {}) => ({
  ...payload,
  userId: toNumber(payload.userId, null),
  courseId: toNumber(payload.courseId, null),
  completedVideos: toNumber(payload.completedVideos, 0),
  totalVideos: toNumber(payload.totalVideos, 0),
  progress: toNumber(payload.progress, 0),
  playlists: Array.isArray(payload.playlists)
    ? payload.playlists.map(normalizePlaylist)
    : [],
})

const cleanPayload = (payload = {}) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  )

export async function login(credentials) {
  const response = await api.post('/auth/login', cleanPayload(credentials))
  return {
    ...response.data,
    user: normalizeUser(response.data?.user),
  }
}

export async function register(userData) {
  const response = await api.post('/auth/register', cleanPayload(userData))
  return {
    ...response.data,
    user: normalizeUser(response.data?.user),
  }
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me')
  return normalizeUser(response.data)
}

export async function logout() {
  const response = await api.post('/auth/logout')
  return response.data
}

export async function getUsers() {
  const response = await api.get('/users')
  return Array.isArray(response.data) ? response.data.map(normalizeUser) : []
}

export async function updateUser(id, updates) {
  const response = await api.put(`/users/${id}`, cleanPayload(updates))
  return normalizeUser(response.data)
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
  return id
}

export async function getCourses(userId) {
  const response = await api.get('/courses', {
    params: userId ? { userId } : undefined,
  })

  return Array.isArray(response.data) ? response.data.map(normalizeCourse) : []
}

export async function getCourseById(id, userId) {
  const response = await api.get(`/courses/${id}`, {
    params: userId ? { userId } : undefined,
  })
  return normalizeCourse(response.data)
}

export async function searchCourses(keyword, userId) {
  if (!keyword?.trim()) {
    return getCourses(userId)
  }

  const response = await api.get('/courses/search', {
    params: cleanPayload({
      keyword: keyword.trim(),
      userId,
    }),
  })

  return Array.isArray(response.data) ? response.data.map(normalizeCourse) : []
}

export async function addCourse(course) {
  const payload = cleanPayload({
    name: course.name?.trim(),
    description: course.description?.trim(),
    level: course.level,
    category: course.category?.trim(),
    duration: course.duration?.trim(),
    featured: course.featured,
    rating: course.rating,
    thumbnail: course.thumbnail,
    teacherId: course.teacherId,
    requesterId: course.requesterId,
  })

  const response = await api.post('/courses', payload)
  return normalizeCourse(response.data)
}

export async function updateCourse(id, course) {
  const payload = cleanPayload({
    name: course.name?.trim(),
    description: course.description?.trim(),
    level: course.level,
    category: course.category?.trim(),
    duration: course.duration?.trim(),
    featured: course.featured,
    rating: course.rating,
    thumbnail: course.thumbnail,
    teacherId: course.teacherId,
    requesterId: course.requesterId,
  })

  const response = await api.put(`/courses/${id}`, payload)
  return normalizeCourse(response.data)
}

export async function deleteCourse(id, requesterId) {
  await api.delete(`/courses/${id}`, {
    params: requesterId ? { requesterId } : undefined,
  })
  return id
}

export async function getPlaylists(courseId, userId) {
  const response = await api.get(`/playlists/${courseId}`, {
    params: userId ? { userId } : undefined,
  })
  return Array.isArray(response.data) ? response.data.map(normalizePlaylist) : []
}

export async function addPlaylist(data) {
  const payload = cleanPayload({
    courseId: toNumber(data.courseId, null),
    requesterId: data.requesterId,
    title: data.title?.trim(),
    youtubeUrl: data.youtubeUrl?.trim(),
    level: data.level,
    duration: data.duration?.trim(),
    order: data.order,
  })

  const response = await api.post('/playlists', payload)
  return normalizePlaylist(response.data)
}

export async function updatePlaylist(id, data) {
  const payload = cleanPayload({
    courseId: toNumber(data.courseId, null),
    requesterId: data.requesterId,
    title: data.title?.trim(),
    youtubeUrl: data.youtubeUrl?.trim(),
    level: data.level,
    duration: data.duration?.trim(),
    order: data.order,
  })

  const response = await api.put(`/playlists/${id}`, payload)
  return normalizePlaylist(response.data)
}

export async function deletePlaylist(id, requesterId) {
  await api.delete(`/playlists/${id}`, {
    params: requesterId ? { requesterId } : undefined,
  })
  return id
}

export async function getMyCourses(userId) {
  const response = await api.get(`/my-courses/${userId}`)
  return Array.isArray(response.data) ? response.data.map(normalizeCourse) : []
}

export async function enrollCourse(courseId, userId, requesterId) {
  const response = await api.post(`/enroll/${courseId}`, null, {
    params: cleanPayload({ userId, requesterId }),
  })
  return normalizeCourse(response.data)
}

export async function markComplete({ userId, playlistId, requesterId, completed = true }) {
  const response = await api.post('/progress/complete', cleanPayload({
    userId,
    playlistId,
    requesterId,
    completed,
  }))
  return normalizeProgress(response.data)
}

export async function getProgress(userId, courseId) {
  const response = await api.get(`/progress/${userId}/${courseId}`)
  return normalizeProgress(response.data)
}

export { normalizeCourse, normalizePlaylist, normalizeUser }

export default api
