import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, BookOpen, Award, Clock, Trash2, Settings, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import VideoPlayer from '../components/VideoPlayer'
import PlaylistSidebar from '../components/PlaylistSidebar'
import AddPlaylistModal from '../components/AddPlaylistModal'
import {
  addPlaylist as addPlaylistApi,
  deletePlaylist as deletePlaylistApi,
  enrollCourse,
  getApiErrorMessage,
  getCourseById,
  getMyCourses,
  getProgress,
  markComplete,
} from '../services/api'

const mergeCourseProgress = (course, progressData) => {
  if (!course) return null
  if (!progressData) return course

  const completedIds = new Set((progressData.playlists ?? []).filter((playlist) => playlist.completed).map((playlist) => playlist.id))

  return {
    ...course,
    progress: progressData.progress ?? course.progress ?? 0,
    playlists: (course.playlists ?? []).map((playlist) => ({
      ...playlist,
      completed: completedIds.has(playlist.id),
    })),
  }
}

export default function CourseDetail() {
  const { id } = useParams()
  const courseId = Number(id)
  const { currentUser, refreshData } = useData()
  const [course, setCourse] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [activeVideoId, setActiveVideoId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadCourseDetail = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [courseResponse, myCoursesResponse, progressResponse] = await Promise.all([
        getCourseById(courseId, currentUser?.id),
        currentUser?.role === 'STUDENT' ? getMyCourses(currentUser.id) : Promise.resolve([]),
        currentUser?.role === 'STUDENT' ? getProgress(currentUser.id, courseId) : Promise.resolve(null),
      ])

      const nextCourse = mergeCourseProgress(courseResponse, progressResponse)
      setCourse(nextCourse)
      setProgressData(progressResponse)
      setEnrolled(myCoursesResponse.some((item) => item.id === courseId))
    } catch (loadError) {
      console.error('Failed to load course detail:', loadError)
      setError(getApiErrorMessage(loadError, 'Unable to load this course right now.'))
      setCourse(null)
      setProgressData(null)
      setEnrolled(false)
    } finally {
      setLoading(false)
    }
  }, [courseId, currentUser])

  useEffect(() => {
    loadCourseDetail()
  }, [loadCourseDetail])

  const coursePlaylists = course?.playlists ?? []

  useEffect(() => {
    if (coursePlaylists.length === 0) {
      setActiveVideoId(null)
      return
    }

    const hasActiveVideo = coursePlaylists.some((playlist) => playlist.id === activeVideoId)
    if (!hasActiveVideo) {
      setActiveVideoId(coursePlaylists[0].id)
    }
  }, [activeVideoId, coursePlaylists])

  const activeVideo = useMemo(
    () => coursePlaylists.find((playlist) => playlist.id === activeVideoId) ?? null,
    [activeVideoId, coursePlaylists]
  )

  const progress = progressData?.progress ?? course?.progress ?? 0
  const completedCount = progressData?.completedVideos ?? coursePlaylists.filter((playlist) => playlist.completed).length
  const totalCount = progressData?.totalVideos ?? coursePlaylists.length
  const isTeacherOrAdmin = currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN'
  const completedIds = useMemo(
    () => coursePlaylists.filter((playlist) => playlist.completed).map((playlist) => playlist.id),
    [coursePlaylists]
  )

  const handleVideoSelect = useCallback((video) => {
    setActiveVideoId(video.id)
  }, [])

  const handleMarkComplete = useCallback(async () => {
    if (!activeVideo || !currentUser) return

    setActionLoading(true)
    setActionError('')

    try {
      const updatedProgress = await markComplete({
        userId: currentUser.id,
        requesterId: currentUser.id,
        playlistId: activeVideo.id,
        completed: !activeVideo.completed,
      })

      setProgressData(updatedProgress)
      setCourse((previousCourse) => mergeCourseProgress(previousCourse, updatedProgress))
      await refreshData()
    } catch (completeError) {
      console.error('Failed to update progress:', completeError)
      setActionError(getApiErrorMessage(completeError, 'Unable to update your progress right now.'))
    } finally {
      setActionLoading(false)
    }
  }, [activeVideo, currentUser])

  const handleNextVideo = useCallback(() => {
    if (!activeVideo) return

    const currentIndex = coursePlaylists.findIndex((playlist) => playlist.id === activeVideo.id)
    if (currentIndex < coursePlaylists.length - 1) {
      setActiveVideoId(coursePlaylists[currentIndex + 1].id)
    }
  }, [activeVideo, coursePlaylists])

  const hasNext = useMemo(() => {
    if (!activeVideo) return false
    return coursePlaylists.findIndex((playlist) => playlist.id === activeVideo.id) < coursePlaylists.length - 1
  }, [activeVideo, coursePlaylists])

  const handleEnroll = useCallback(async () => {
    if (!currentUser) return

    setActionLoading(true)
    setActionError('')

    try {
      await enrollCourse(courseId, currentUser.id, currentUser.id)
      await Promise.all([loadCourseDetail(), refreshData()])
    } catch (enrollError) {
      console.error('Failed to enroll:', enrollError)
      setActionError(getApiErrorMessage(enrollError, 'Unable to enroll in this course right now.'))
    } finally {
      setActionLoading(false)
    }
  }, [courseId, currentUser, loadCourseDetail])

  const handleAddPlaylist = useCallback(async (playlist) => {
    if (!currentUser) {
      throw new Error('Login required')
    }

    setActionError('')

    try {
      const createdPlaylist = await addPlaylistApi({
        ...playlist,
        requesterId: currentUser.id,
      })

      setCourse((previousCourse) => previousCourse ? {
        ...previousCourse,
        playlists: [...previousCourse.playlists, createdPlaylist].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)),
      } : previousCourse)
      setActiveVideoId(createdPlaylist.id)
      await refreshData()
      return createdPlaylist
    } catch (playlistError) {
      console.error('Failed to add playlist:', playlistError)
      setActionError(getApiErrorMessage(playlistError, 'Unable to add this video right now.'))
      throw playlistError
    }
  }, [currentUser])

  const handleDeletePlaylist = useCallback(async (playlistId) => {
    if (!currentUser) return

    setActionLoading(true)
    setActionError('')

    try {
      await deletePlaylistApi(playlistId, currentUser.id)
      await Promise.all([loadCourseDetail(), refreshData()])
    } catch (deleteError) {
      console.error('Failed to delete playlist:', deleteError)
      setActionError(getApiErrorMessage(deleteError, 'Unable to delete this video right now.'))
    } finally {
      setActionLoading(false)
    }
  }, [currentUser, loadCourseDetail])

  if (loading) {
    return (
      <div className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading course content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
        <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Course Not Found</h1>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">{error || 'The requested course is unavailable.'}</p>
        <Link to="/courses" className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"><ArrowLeft className="h-4 w-4" />Back to Courses</Link>
      </div>
    )
  }

  return (
    <>
      <div className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"><ArrowLeft className="h-4 w-4" />Back to Courses</Link>

          <div className="animate-fade-in-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">{course.name}</h1>
              <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">{course.description}</p>
              {course.instructor && <p className="mt-1 text-xs text-[var(--muted-foreground)]">by <span className="font-medium text-[var(--foreground)]">{course.instructor}</span></p>}
            </div>
            <div className="flex shrink-0 gap-2">
              {!enrolled && currentUser?.role === 'STUDENT' && (
                <button onClick={handleEnroll} disabled={actionLoading} className="flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70">
                  <CheckCircle2 className="h-4 w-4" /> {actionLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              {isTeacherOrAdmin && (
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110">
                  <Plus className="h-4 w-4" />Add Video
                </button>
              )}
            </div>
          </div>

          {(error || actionError) && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError || error}
            </div>
          )}

          <div className="animate-fade-in-up mb-6 flex flex-wrap items-center gap-6 rounded-2xl border bg-white p-4 shadow-sm">
            <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><BookOpen className="h-4 w-4 text-[var(--primary)]" />{totalCount} videos</span>
            <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><Award className="h-4 w-4 text-emerald-500" />{completedCount} completed</span>
            {course.duration && <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><Clock className="h-4 w-4 text-amber-500" />{course.duration}</span>}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm font-bold text-[var(--primary)]">{progress}%</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--secondary)]">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="animate-slide-in-left">
              <VideoPlayer
                youtubeUrl={activeVideo?.youtubeUrl}
                title={activeVideo?.title}
                isCompleted={Boolean(activeVideo?.completed)}
                onMarkComplete={activeVideo && enrolled && currentUser?.role === 'STUDENT' ? handleMarkComplete : null}
                onNextVideo={hasNext ? handleNextVideo : null}
                hasNext={hasNext}
              />

              {currentUser?.role === 'ADMIN' && coursePlaylists.length > 0 && (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 p-5">
                  <div className="mb-3 flex items-center gap-2"><Settings className="h-4 w-4 text-red-500" /><h3 className="text-sm font-bold text-red-700">Admin: Remove Videos</h3></div>
                  <div className="space-y-2">
                    {coursePlaylists.map((playlist) => (
                      <div key={playlist.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                        <span className="text-sm">{playlist.title}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${playlist.title}"?`)) {
                              handleDeletePlaylist(playlist.id)
                            }
                          }}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                        >
                          <Trash2 className="h-3 w-3" />Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="animate-slide-in-right lg:sticky lg:top-20 lg:h-[calc(100vh-12rem)]">
              <PlaylistSidebar
                playlists={coursePlaylists}
                activeVideoId={activeVideo?.id}
                completedIds={completedIds}
                onVideoSelect={handleVideoSelect}
                courseName={course.name}
              />
            </div>
          </div>
        </div>
      </div>
      <AddPlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseId={courseId} onSubmit={handleAddPlaylist} />
    </>
  )
}
