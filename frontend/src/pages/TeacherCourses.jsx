import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, Trash2, Edit2, PlayCircle, Users, PlusCircle, X, Check, ArrowLeft } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function TeacherCourses() {
  const { getTeacherCourses, playlists, updateCourse, deleteCourse, addPlaylist, updatePlaylist, deletePlaylist } = useData()
  const teacherCourses = getTeacherCourses()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseForm, setCourseForm] = useState({ name: '', description: '' })
  const [showPlaylistForm, setShowPlaylistForm] = useState(false)
  const [playlistForm, setPlaylistForm] = useState({ title: '', youtubeUrl: '', level: 'Beginner', duration: '' })
  const [editingPlaylist, setEditingPlaylist] = useState(null)

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    if (editingCourse && courseForm.name.trim()) {
      const updatedCourse = await updateCourse(editingCourse.id, { name: courseForm.name.trim(), description: courseForm.description.trim() })
      if (updatedCourse) {
        setEditingCourse(null)
        setCourseForm({ name: '', description: '' })
      }
    }
  }

  const handleAddPlaylist = async (e) => {
    e.preventDefault()
    if (selectedCourse && playlistForm.title.trim() && playlistForm.youtubeUrl.trim()) {
      const createdPlaylist = await addPlaylist({ courseId: selectedCourse.id, title: playlistForm.title.trim(), youtubeUrl: playlistForm.youtubeUrl.trim(), level: playlistForm.level, duration: playlistForm.duration })
      if (createdPlaylist) {
        setPlaylistForm({ title: '', youtubeUrl: '', level: 'Beginner', duration: '' })
        setShowPlaylistForm(false)
      }
    }
  }

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault()
    if (editingPlaylist) {
      const updatedPlaylist = await updatePlaylist(editingPlaylist.id, { courseId: selectedCourse?.id, title: playlistForm.title.trim(), youtubeUrl: playlistForm.youtubeUrl.trim(), level: playlistForm.level, duration: playlistForm.duration })
      if (updatedPlaylist) {
        setEditingPlaylist(null)
        setPlaylistForm({ title: '', youtubeUrl: '', level: 'Beginner', duration: '' })
      }
    }
  }

  const coursePlaylists = selectedCourse ? playlists.filter((p) => p.courseId === selectedCourse.id) : []

  if (selectedCourse) {
    return (
      <div className="py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <button onClick={() => { setSelectedCourse(null); setEditingPlaylist(null); setShowPlaylistForm(false) }}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]">
            <ArrowLeft className="h-4 w-4" /> Back to My Courses
          </button>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{selectedCourse.name}</h1>
              <p className="text-sm text-[var(--muted-foreground)]">{coursePlaylists.length} videos</p>
            </div>
            <button onClick={() => setShowPlaylistForm(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <Plus className="h-4 w-4" /> Add Video
            </button>
          </div>

          {/* Add / Edit Playlist Form */}
          {(showPlaylistForm || editingPlaylist) && (
            <form onSubmit={editingPlaylist ? handleUpdatePlaylist : handleAddPlaylist} className="mb-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
              <h3 className="mb-4 font-bold text-[var(--foreground)]">{editingPlaylist ? 'Edit Video' : 'Add New Video'}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm font-medium">Title</label><input type="text" value={playlistForm.title} onChange={(e) => setPlaylistForm({ ...playlistForm, title: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required /></div>
                <div><label className="mb-1 block text-sm font-medium">YouTube URL</label><input type="url" value={playlistForm.youtubeUrl} onChange={(e) => setPlaylistForm({ ...playlistForm, youtubeUrl: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="https://youtube.com/watch?v=..." required /></div>
                <div><label className="mb-1 block text-sm font-medium">Level</label><select value={playlistForm.level} onChange={(e) => setPlaylistForm({ ...playlistForm, level: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                <div><label className="mb-1 block text-sm font-medium">Duration</label><input type="text" value={playlistForm.duration} onChange={(e) => setPlaylistForm({ ...playlistForm, duration: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" placeholder="e.g. 1 hr 30 min" /></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Check className="h-4 w-4" />{editingPlaylist ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowPlaylistForm(false); setEditingPlaylist(null); setPlaylistForm({ title: '', youtubeUrl: '', level: 'Beginner', duration: '' }) }} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"><X className="h-4 w-4" />Cancel</button>
              </div>
            </form>
          )}

          {/* Playlist List */}
          <div className="space-y-3">
            {coursePlaylists.map((pl, i) => (
              <div key={pl.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-600">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--foreground)]">{pl.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className={`rounded px-1.5 py-0.5 ${pl.level === 'Beginner' ? 'bg-green-50 text-green-600' : pl.level === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{pl.level}</span>
                    {pl.duration && <span>{pl.duration}</span>}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditingPlaylist(pl); setPlaylistForm({ title: pl.title, youtubeUrl: pl.youtubeUrl, level: pl.level, duration: pl.duration || '' }) }} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={async () => { if (window.confirm('Delete this video?')) await deletePlaylist(pl.id) }} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            {coursePlaylists.length === 0 && (
              <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center">
                <PlayCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-[var(--muted-foreground)]">No videos yet. Add your first video above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">My Courses</h1>
            <p className="text-sm text-[var(--muted-foreground)]">{teacherCourses.length} courses created</p>
          </div>
          <Link to="/teacher/create-course" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"><PlusCircle className="h-4 w-4" /> New Course</Link>
        </div>

        {/* Edit Course Form */}
        {editingCourse && (
          <form onSubmit={handleUpdateCourse} className="mb-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
            <h3 className="mb-4 font-bold">Edit Course</h3>
            <div className="space-y-3">
              <input type="text" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Course Name" required />
              <textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" rows={3} placeholder="Description" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Check className="h-4 w-4" />Save</button>
              <button type="button" onClick={() => { setEditingCourse(null); setCourseForm({ name: '', description: '' }) }} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"><X className="h-4 w-4" />Cancel</button>
            </div>
          </form>
        )}

        {/* Course List */}
        <div className="space-y-3">
          {teacherCourses.map((c) => {
            const vids = playlists.filter((p) => p.courseId === c.id).length
            const students = c.students || 0
            return (
              <div key={c.id} className="group flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><BookOpen className="h-6 w-6 text-emerald-600" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--foreground)]">{c.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{vids} videos · {students} students · {c.level}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelectedCourse(c)} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Manage</button>
                  <button onClick={() => { setEditingCourse(c); setCourseForm({ name: c.name, description: c.description || '' }) }} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={async () => { if (window.confirm('Delete this course?')) await deleteCourse(c.id) }} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )
          })}
          {teacherCourses.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-[var(--foreground)]">No courses yet</p>
              <Link to="/teacher/create-course" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><PlusCircle className="h-4 w-4" />Create Course</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
