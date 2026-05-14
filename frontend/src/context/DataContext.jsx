import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { initialReports } from '../data/dummyData'
import {
  addCourse as addCourseApi,
  addPlaylist as addPlaylistApi,
  deleteCourse as deleteCourseApi,
  deletePlaylist as deletePlaylistApi,
  deleteUser as deleteUserApi,
  enrollCourse as enrollCourseApi,
  getApiErrorMessage,
  getCourses as getCoursesApi,
  getCurrentUser as getCurrentUserApi,
  getMyCourses as getMyCoursesApi,
  getUsers as getUsersApi,
  login as loginApi,
  logout as logoutApi,
  markComplete as markCompleteApi,
  register as registerApi,
  updateCourse as updateCourseApi,
  updatePlaylist as updatePlaylistApi,
  updateUser as updateUserApi,
} from '../services/api'

const DataContext = createContext()

const upsertCourse = (items, nextCourse) => {
  const hasMatch = items.some((item) => item.id === nextCourse.id)
  return hasMatch
    ? items.map((item) => (item.id === nextCourse.id ? nextCourse : item))
    : [...items, nextCourse]
}

const removeById = (items, id) => items.filter((item) => item.id !== id)

export function DataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState('')
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [reports, setReports] = useState(initialReports)

  const loadCourses = useCallback(async (user = currentUser) => {
    const nextCourses = await getCoursesApi(user?.id)
    setCourses(nextCourses)
    return nextCourses
  }, [currentUser])

  const loadMyCourses = useCallback(async (user = currentUser) => {
    if (!user || user.role !== 'STUDENT') {
      setMyCourses([])
      return []
    }

    const nextCourses = await getMyCoursesApi(user.id)
    setMyCourses(nextCourses)
    return nextCourses
  }, [currentUser])

  const loadUsers = useCallback(async (user = currentUser) => {
    if (!user) {
      setUsers([])
      return []
    }

    if (user.role !== 'ADMIN') {
      setUsers([user])
      return [user]
    }

    const nextUsers = await getUsersApi()
    setUsers(nextUsers)
    return nextUsers
  }, [currentUser])

  const syncAppData = useCallback(async (user = currentUser) => {
    if (!user) {
      setCourses([])
      setMyCourses([])
      setUsers([])
      setDataError('')
      return
    }

    setDataLoading(true)
    setDataError('')

    try {
      await Promise.all([
        loadCourses(user),
        loadMyCourses(user),
        loadUsers(user),
      ])
    } catch (error) {
      console.error('Failed to sync app data:', error)
      setDataError(getApiErrorMessage(error, 'Unable to load backend data right now.'))
    } finally {
      setDataLoading(false)
    }
  }, [currentUser, loadCourses, loadMyCourses, loadUsers])

  useEffect(() => {
    let isActive = true

    const bootstrap = async () => {
      setAuthLoading(true)

      try {
        const user = await getCurrentUserApi()
        if (!isActive) return
        setCurrentUser(user)
      } catch {
        if (!isActive) return
        setCurrentUser(null)
      } finally {
        if (isActive) {
          setAuthLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    syncAppData()
  }, [authLoading, currentUser, syncAppData])

  const courseCollection = useMemo(() => {
    const map = new Map()

    for (const course of [...courses, ...myCourses]) {
      map.set(course.id, course)
    }

    return map
  }, [courses, myCourses])

  const playlists = useMemo(() => {
    const map = new Map()

    for (const course of courseCollection.values()) {
      for (const playlist of course.playlists ?? []) {
        map.set(playlist.id, playlist)
      }
    }

    return [...map.values()].sort((left, right) => {
      if (left.courseId !== right.courseId) {
        return (left.courseId ?? 0) - (right.courseId ?? 0)
      }
      return (left.order ?? 0) - (right.order ?? 0)
    })
  }, [courseCollection])

  const enrollments = useMemo(() => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      return []
    }

    return myCourses.map((course) => ({
      userId: currentUser.id,
      courseId: course.id,
    }))
  }, [currentUser, myCourses])

  const completedPlaylists = useMemo(
    () => playlists.filter((playlist) => playlist.completed).map((playlist) => playlist.id),
    [playlists]
  )

  const certificates = useMemo(() => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      return []
    }

    return myCourses
      .filter((course) => Number(course.progress) === 100)
      .map((course) => ({
        id: course.id,
        userId: currentUser.id,
        courseId: course.id,
        courseName: course.name,
        issuedDate: new Date().toISOString().split('T')[0],
        certId: `CERT-${course.id}-${currentUser.id}`,
      }))
  }, [currentUser, myCourses])

  const getCourseRecord = useCallback((courseId) => {
    const normalizedId = Number(courseId)
    return courseCollection.get(normalizedId) ?? null
  }, [courseCollection])

  const login = useCallback(async (email, password) => {
    try {
      const response = await loginApi({ email, password })
      setCurrentUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: getApiErrorMessage(error, 'Invalid email or password'),
      }
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      const response = await registerApi(userData)
      setCurrentUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        error: getApiErrorMessage(error, 'Unable to register right now.'),
      }
    }
  }, [])

  const logout = useCallback(async () => {
    setCurrentUser(null)
    setUsers([])
    setCourses([])
    setMyCourses([])
    setRecentActivity([])
    setDataError('')

    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!currentUser) return null

    try {
      const updatedUser = await updateUserApi(currentUser.id, updates)
      setCurrentUser(updatedUser)
      setUsers((previousUsers) => {
        if (previousUsers.length === 0) return [updatedUser]
        return previousUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      })
      return updatedUser
    } catch (error) {
      console.error('Profile update failed:', error)
      return null
    }
  }, [currentUser])

  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      const updatedUser = await updateUserApi(userId, { role: newRole })
      setUsers((previousUsers) =>
        previousUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      )
      if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser)
      }
      return updatedUser
    } catch (error) {
      console.error('User role update failed:', error)
      return null
    }
  }, [currentUser])

  const deleteUser = useCallback(async (userId) => {
    try {
      await deleteUserApi(userId)
      setUsers((previousUsers) => removeById(previousUsers, userId))
      return true
    } catch (error) {
      console.error('User deletion failed:', error)
      return false
    }
  }, [])

  const addCourse = useCallback(async (course) => {
    if (!currentUser) return null

    try {
      const createdCourse = await addCourseApi({
        ...course,
        teacherId: course.teacherId ?? currentUser.id,
        requesterId: currentUser.id,
      })

      setCourses((previousCourses) => upsertCourse(previousCourses, createdCourse))
      return createdCourse
    } catch (error) {
      console.error('Add course failed:', error)
      return null
    }
  }, [currentUser])

  const updateCourse = useCallback(async (id, updates) => {
    if (!currentUser) return null

    try {
      const updatedCourse = await updateCourseApi(id, {
        ...updates,
        requesterId: currentUser.id,
        teacherId: updates.teacherId ?? currentUser.id,
      })

      setCourses((previousCourses) => upsertCourse(previousCourses, updatedCourse))
      setMyCourses((previousCourses) => previousCourses.map((course) => (
        course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
      )))
      return updatedCourse
    } catch (error) {
      console.error('Update course failed:', error)
      return null
    }
  }, [currentUser])

  const deleteCourse = useCallback(async (id) => {
    if (!currentUser) return false

    try {
      await deleteCourseApi(id, currentUser.id)
      setCourses((previousCourses) => removeById(previousCourses, id))
      setMyCourses((previousCourses) => removeById(previousCourses, id))
      setRecentActivity((previousActivity) => previousActivity.filter((item) => item.courseId !== id))
      return true
    } catch (error) {
      console.error('Delete course failed:', error)
      return false
    }
  }, [currentUser])

  const addPlaylist = useCallback(async (playlist) => {
    if (!currentUser) return null

    try {
      const createdPlaylist = await addPlaylistApi({
        ...playlist,
        requesterId: currentUser.id,
      })
      await syncAppData(currentUser)
      return createdPlaylist
    } catch (error) {
      console.error('Add playlist failed:', error)
      return null
    }
  }, [currentUser, syncAppData])

  const updatePlaylist = useCallback(async (id, updates) => {
    if (!currentUser) return null

    try {
      const updatedPlaylist = await updatePlaylistApi(id, {
        ...updates,
        requesterId: currentUser.id,
      })
      await syncAppData(currentUser)
      return updatedPlaylist
    } catch (error) {
      console.error('Update playlist failed:', error)
      return null
    }
  }, [currentUser, syncAppData])

  const deletePlaylist = useCallback(async (id) => {
    if (!currentUser) return false

    try {
      await deletePlaylistApi(id, currentUser.id)
      await syncAppData(currentUser)
      return true
    } catch (error) {
      console.error('Delete playlist failed:', error)
      return false
    }
  }, [currentUser, syncAppData])

  const enrollInCourse = useCallback(async (courseId) => {
    if (!currentUser) return false

    try {
      await enrollCourseApi(courseId, currentUser.id, currentUser.id)
      await syncAppData(currentUser)
      return true
    } catch (error) {
      console.error('Enrollment failed:', error)
      return false
    }
  }, [currentUser, syncAppData])

  const isEnrolled = useCallback((courseId) => {
    const normalizedId = Number(courseId)
    return myCourses.some((course) => course.id === normalizedId)
  }, [myCourses])

  const getEnrolledCourses = useCallback(() => myCourses, [myCourses])

  const togglePlaylistComplete = useCallback(async (playlistId) => {
    if (!currentUser) return null

    const playlist = playlists.find((item) => item.id === playlistId)
    const nextCompletedState = !completedPlaylists.includes(playlistId)

    try {
      const progress = await markCompleteApi({
        userId: currentUser.id,
        requesterId: currentUser.id,
        playlistId,
        completed: nextCompletedState,
      })

      await syncAppData(currentUser)

      if (playlist) {
        setRecentActivity((previousActivity) => [
          {
            id: Date.now(),
            playlistId,
            courseId: playlist.courseId,
            action: nextCompletedState ? 'Completed' : 'Unwatched',
            timestamp: new Date().toISOString(),
          },
          ...previousActivity,
        ].slice(0, 20))
      }

      return progress
    } catch (error) {
      console.error('Progress update failed:', error)
      return null
    }
  }, [completedPlaylists, currentUser, playlists, syncAppData])

  const isPlaylistComplete = useCallback((playlistId) => completedPlaylists.includes(Number(playlistId)), [completedPlaylists])

  const getCourseProgress = useCallback((courseId) => Number(getCourseRecord(courseId)?.progress ?? 0), [getCourseRecord])

  const getOverallProgress = useCallback(() => {
    const enrolledPlaylists = myCourses.flatMap((course) => course.playlists ?? [])
    if (enrolledPlaylists.length === 0) return 0

    const completedCount = enrolledPlaylists.filter((playlist) => playlist.completed).length
    return Math.round((completedCount / enrolledPlaylists.length) * 100)
  }, [myCourses])

  const getCourseCompletedCount = useCallback((courseId) => {
    return (getCourseRecord(courseId)?.playlists ?? []).filter((playlist) => playlist.completed).length
  }, [getCourseRecord])

  const getCourseTotalCount = useCallback((courseId) => {
    return (getCourseRecord(courseId)?.playlists ?? []).length
  }, [getCourseRecord])

  const getTotalCompletedVideos = useCallback(() => completedPlaylists.length, [completedPlaylists])

  const getCompletedCoursesCount = useCallback(() => {
    return myCourses.filter((course) => Number(course.progress) === 100).length
  }, [myCourses])

  const getTeacherCourses = useCallback(() => {
    if (!currentUser) return []
    return courses.filter((course) => course.instructorId === currentUser.id)
  }, [currentUser, courses])

  const getTeacherStudentCount = useCallback(() => {
    return getTeacherCourses().reduce((total, course) => total + Number(course.students || 0), 0)
  }, [getTeacherCourses])

  const getTeacherVideoCount = useCallback(() => {
    return getTeacherCourses().reduce((total, course) => total + (course.playlists?.length || 0), 0)
  }, [getTeacherCourses])

  const updateReportStatus = useCallback((reportId, status) => {
    setReports((previousReports) =>
      previousReports.map((report) => (report.id === reportId ? { ...report, status } : report))
    )
  }, [])

  const addReport = useCallback((report) => {
    setReports((previousReports) => [
      {
        ...report,
        id: Date.now(),
        reportedBy: currentUser?.id,
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
      ...previousReports,
    ])
  }, [currentUser])

  const value = {
    currentUser,
    authLoading,
    dataLoading,
    dataError,
    users,
    courses,
    playlists,
    enrollments,
    completedPlaylists,
    recentActivity,
    certificates,
    reports,
    login,
    register,
    logout,
    updateProfile,
    updateUserRole,
    deleteUser,
    addCourse,
    updateCourse,
    deleteCourse,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    enrollInCourse,
    isEnrolled,
    getEnrolledCourses,
    togglePlaylistComplete,
    isPlaylistComplete,
    getCourseProgress,
    getOverallProgress,
    getCourseCompletedCount,
    getCourseTotalCount,
    getTotalCompletedVideos,
    getCompletedCoursesCount,
    getTeacherCourses,
    getTeacherStudentCount,
    getTeacherVideoCount,
    updateReportStatus,
    addReport,
    refreshData: syncAppData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
