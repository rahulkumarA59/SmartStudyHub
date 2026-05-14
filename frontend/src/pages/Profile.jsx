import { useState, useRef, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X, BookOpen, Award, Calendar, Camera, CheckCircle2, GraduationCap } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Profile() {
  const { currentUser, updateProfile, getEnrolledCourses, getCourseProgress, getCompletedCoursesCount, getTotalCompletedVideos, certificates } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '', bio: currentUser?.bio || '', location: currentUser?.location || '' })
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setEditForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
    })
    setAvatarPreview(currentUser?.avatar)
  }, [currentUser])

  const enrolledCourses = getEnrolledCourses()
  const completedCoursesCount = getCompletedCoursesCount()
  const completedVideos = getTotalCompletedVideos()

  const handleSave = async () => {
    const updatedProfile = await updateProfile({ ...editForm, avatar: avatarPreview })
    if (updatedProfile) {
      setIsEditing(false)
    }
  }
  const handleCancel = () => { setEditForm({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '', bio: currentUser?.bio || '', location: currentUser?.location || '' }); setAvatarPreview(currentUser?.avatar); setIsEditing(false) }
  const handleImageUpload = (e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setAvatarPreview(r.result); r.readAsDataURL(f) } }
  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const profileStats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Videos Completed', value: completedVideos, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Courses Completed', value: completedCoursesCount, icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="animate-fade-in-up mb-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="relative h-36 bg-gradient-to-br from-[var(--primary)] via-[hsl(230,80%,55%)] to-[hsl(263,70%,58%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-16 mb-4 flex items-end justify-between">
              <div className="relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={currentUser?.name} className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg" />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] text-3xl font-bold text-white shadow-lg">
                    {getInitials(currentUser?.name)}
                  </div>
                )}
                {isEditing && (
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-md hover:scale-110">
                    <Camera className="h-4 w-4 text-[var(--primary)]" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-xl bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/20">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-110"><Save className="h-4 w-4" />Save</button>
                  <button onClick={handleCancel} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"><X className="h-4 w-4" />Cancel</button>
                </div>
              )}
            </div>
            {!isEditing ? (
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{currentUser?.name}</h1>
                {currentUser?.bio && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{currentUser.bio}</p>}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{currentUser?.email}</span>
                  {currentUser?.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{currentUser.phone}</span>}
                  {currentUser?.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{currentUser.location}</span>}
                  {currentUser?.joinedDate && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Joined {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'name', icon: User, label: 'Full Name', type: 'text' },
                    { key: 'email', icon: Mail, label: 'Email', type: 'email' },
                    { key: 'phone', icon: Phone, label: 'Phone', type: 'tel' },
                    { key: 'location', icon: MapPin, label: 'Location', type: 'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                      <div className="relative">
                        <f.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type={f.type} value={editForm[f.key]} onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Bio</label>
                  <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="Tell us about yourself..." />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {profileStats.map((s) => (
            <div key={s.label} className="group flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} transition-transform group-hover:scale-110`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              <div><p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Enrolled Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {enrolledCourses.map((c) => {
                const progress = getCourseProgress(c.id)
                return (
                  <div key={c.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10"><BookOpen className="h-5 w-5 text-[var(--primary)]" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">{c.name}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                        <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">{progress}%</span>
                      </div>
                    </div>
                    {progress === 100 && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center"><p className="text-sm text-[var(--muted-foreground)]">No enrolled courses yet</p></div>
          )}
        </div>

        {/* Certificates */}
        <div className="animate-fade-in-up">
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Certificates</h2>
          {certificates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-5 shadow-sm hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100"><Award className="h-5 w-5 text-amber-600" /></div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">{cert.courseName}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">Issued {new Date(cert.issuedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="mt-1 font-mono text-[10px] text-gray-400">{cert.certId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center">
              <Award className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-[var(--muted-foreground)]">Complete courses to earn certificates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
