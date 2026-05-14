import { useState } from 'react'
import { useData } from '../context/DataContext'
import { Plus, Trash2, Edit2, X, Check, LogOut, BookOpen, PlayCircle } from 'lucide-react'

export default function AdminPanel() {
  const { 
    courses, 
    playlists, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    addPlaylist, 
    updatePlaylist, 
    deletePlaylist,
    logout 
  } = useData()

  const [activeTab, setActiveTab] = useState('courses')
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showPlaylistForm, setShowPlaylistForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingPlaylist, setEditingPlaylist] = useState(null)

  const [courseForm, setCourseForm] = useState({ name: '', description: '' })
  const [playlistForm, setPlaylistForm] = useState({ 
    courseId: '', 
    title: '', 
    youtubeUrl: '', 
    level: 'Beginner' 
  })

  const handleAddCourse = (e) => {
    e.preventDefault()
    if (courseForm.name && courseForm.description) {
      addCourse(courseForm)
      setCourseForm({ name: '', description: '' })
      setShowCourseForm(false)
    }
  }

  const handleUpdateCourse = (e) => {
    e.preventDefault()
    if (editingCourse && courseForm.name && courseForm.description) {
      updateCourse(editingCourse.id, courseForm)
      setCourseForm({ name: '', description: '' })
      setEditingCourse(null)
    }
  }

  const handleAddPlaylist = (e) => {
    e.preventDefault()
    if (playlistForm.courseId && playlistForm.title && playlistForm.youtubeUrl) {
      addPlaylist({ ...playlistForm, courseId: parseInt(playlistForm.courseId) })
      setPlaylistForm({ courseId: '', title: '', youtubeUrl: '', level: 'Beginner' })
      setShowPlaylistForm(false)
    }
  }

  const handleUpdatePlaylist = (e) => {
    e.preventDefault()
    if (editingPlaylist && playlistForm.title && playlistForm.youtubeUrl) {
      updatePlaylist(editingPlaylist.id, { 
        ...playlistForm, 
        courseId: parseInt(playlistForm.courseId) 
      })
      setPlaylistForm({ courseId: '', title: '', youtubeUrl: '', level: 'Beginner' })
      setEditingPlaylist(null)
    }
  }

  const startEditCourse = (course) => {
    setEditingCourse(course)
    setCourseForm({ name: course.name, description: course.description })
    setShowCourseForm(false)
  }

  const startEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist)
    setPlaylistForm({
      courseId: playlist.courseId.toString(),
      title: playlist.title,
      youtubeUrl: playlist.youtubeUrl,
      level: playlist.level,
    })
    setShowPlaylistForm(false)
  }

  const cancelEdit = () => {
    setEditingCourse(null)
    setEditingPlaylist(null)
    setCourseForm({ name: '', description: '' })
    setPlaylistForm({ courseId: '', title: '', youtubeUrl: '', level: 'Beginner' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-xl border-2 border-red-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage courses and playlists</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'playlists'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <PlayCircle className="h-4 w-4" />
            Playlists ({playlists.length})
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Add Course Button */}
            {!showCourseForm && !editingCourse && (
              <button
                onClick={() => setShowCourseForm(true)}
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
              >
                <Plus className="h-4 w-4" />
                Add New Course
              </button>
            )}

            {/* Add/Edit Course Form */}
            {(showCourseForm || editingCourse) && (
              <form 
                onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
                className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="Enter course name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="Enter course description"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
                    >
                      <Check className="h-4 w-4" />
                      {editingCourse ? 'Update Course' : 'Add Course'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourseForm(false)
                        cancelEdit()
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Courses List */}
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {playlists.filter(p => p.courseId === course.id).length} playlists
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditCourse(course)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === 'playlists' && (
          <div className="space-y-6">
            {/* Add Playlist Button */}
            {!showPlaylistForm && !editingPlaylist && (
              <button
                onClick={() => setShowPlaylistForm(true)}
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
              >
                <Plus className="h-4 w-4" />
                Add New Playlist
              </button>
            )}

            {/* Add/Edit Playlist Form */}
            {(showPlaylistForm || editingPlaylist) && (
              <form 
                onSubmit={editingPlaylist ? handleUpdatePlaylist : handleAddPlaylist}
                className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold">
                  {editingPlaylist ? 'Edit Playlist' : 'Add New Playlist'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Select Course
                    </label>
                    <select
                      value={playlistForm.courseId}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, courseId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      required
                    >
                      <option value="">Choose a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Playlist Title
                    </label>
                    <input
                      type="text"
                      value={playlistForm.title}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="Enter playlist title"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={playlistForm.youtubeUrl}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, youtubeUrl: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Level
                    </label>
                    <select
                      value={playlistForm.level}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, level: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
                    >
                      <Check className="h-4 w-4" />
                      {editingPlaylist ? 'Update Playlist' : 'Add Playlist'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlaylistForm(false)
                        cancelEdit()
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Playlists List */}
            <div className="space-y-4">
              {playlists.map((playlist) => {
                const course = courses.find(c => c.id === playlist.courseId)
                return (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{playlist.title}</h3>
                      <p className="text-sm text-gray-500">
                        Course: {course?.name || 'Unknown'}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          playlist.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          playlist.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {playlist.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditPlaylist(playlist)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePlaylist(playlist.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
