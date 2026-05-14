import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, Award, BookOpen, Download, CheckCircle2, Target, Zap, BarChart3 } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProgressBar from '../components/ProgressBar'
import CircularProgress from '../components/CircularProgress'

export default function Progress() {
  const { playlists, completedPlaylists, getCourseProgress, getOverallProgress, getCourseCompletedCount, getCourseTotalCount, getEnrolledCourses } = useData()

  const [studentName, setStudentName] = useState('')
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [selectedCourseForCert, setSelectedCourseForCert] = useState(null)

  const enrolledCourses = getEnrolledCourses()
  const overallProgress = getOverallProgress()
  const enrolledPlaylists = playlists.filter((p) => enrolledCourses.some((c) => c.id === p.courseId))
  const completedInEnrolled = enrolledPlaylists.filter((p) => completedPlaylists.includes(p.id)).length

  const stats = [
    { label: 'Courses Started', value: enrolledCourses.filter((c) => getCourseProgress(c.id) > 0).length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Videos Completed', value: completedInEnrolled, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Courses Completed', value: enrolledCourses.filter((c) => getCourseProgress(c.id) === 100).length, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const generateCertificate = async (course) => {
    if (!studentName.trim()) return alert('Please enter your name')
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    doc.setFillColor(250, 250, 255); doc.rect(0, 0, 297, 210, 'F')
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(3); doc.rect(10, 10, 277, 190, 'S')
    doc.setLineWidth(1); doc.rect(15, 15, 267, 180, 'S')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(36); doc.setTextColor(37, 99, 235)
    doc.text('CERTIFICATE', 148.5, 45, { align: 'center' })
    doc.setFontSize(18); doc.setTextColor(100, 100, 100); doc.text('OF COMPLETION', 148.5, 55, { align: 'center' })
    doc.setFontSize(14); doc.setTextColor(60, 60, 60); doc.text('This is to certify that', 148.5, 80, { align: 'center' })
    doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(30, 30, 30); doc.text(studentName, 148.5, 95, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(14); doc.setTextColor(60, 60, 60)
    doc.text('has successfully completed the course', 148.5, 115, { align: 'center' })
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(37, 99, 235); doc.text(course.name, 148.5, 130, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(100, 100, 100)
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 80, 165)
    doc.text(`Certificate ID: CERT-${course.id}-${Date.now().toString(36).toUpperCase()}`, 170, 165)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(37, 99, 235); doc.text('SmartStudyHub', 148.5, 185, { align: 'center' })
    doc.save(`certificate-${course.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    setShowNamePrompt(false); setSelectedCourseForCert(null); setStudentName('')
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-lg shadow-[var(--primary)]/25"><BarChart3 className="h-7 w-7 text-white" /></div>
          <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">Progress Tracking</h1>
          <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">Track your learning journey across all enrolled courses</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3 stagger-children">
          {stats.map((s) => (
            <div key={s.label} className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} transition-transform group-hover:scale-110`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-[var(--foreground)]">{s.value}</p><p className="text-sm text-[var(--muted-foreground)]">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="mb-10 animate-fade-in-up">
          <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-[var(--primary)]/5 via-white to-[hsl(263,70%,58%)]/5 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <div className="shrink-0"><CircularProgress progress={overallProgress} size={160} strokeWidth={12} /></div>
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div><h2 className="text-xl font-bold text-[var(--foreground)]">Overall Progress</h2><p className="text-sm text-[var(--muted-foreground)]">{completedInEnrolled} of {enrolledPlaylists.length} videos completed</p></div>
                <ProgressBar progress={overallProgress} animated />
                <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
                  <span className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]" />Completed: {completedInEnrolled}</span>
                  <span className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded-full bg-[var(--secondary)]" />Remaining: {enrolledPlaylists.length - completedInEnrolled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Course */}
        <div>
          <div className="mb-6 flex items-center gap-2"><Target className="h-5 w-5 text-[var(--primary)]" /><h2 className="text-xl font-bold text-[var(--foreground)]">Course Progress</h2></div>
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2 stagger-children">
              {enrolledCourses.map((course) => {
                const progress = getCourseProgress(course.id)
                const done = getCourseCompletedCount(course.id)
                const total = getCourseTotalCount(course.id)
                return (
                  <div key={course.id} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className={`h-1 w-full ${progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]'}`} />
                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${progress === 100 ? 'bg-emerald-50' : 'bg-[var(--primary)]/10'} transition-transform group-hover:scale-110`}>
                            {progress === 100 ? <Award className="h-5 w-5 text-emerald-600" /> : <BookOpen className="h-5 w-5 text-[var(--primary)]" />}
                          </div>
                          <div><h3 className="font-bold text-[var(--foreground)]">{course.name}</h3><p className="text-xs text-[var(--muted-foreground)]">{done} of {total} videos</p></div>
                        </div>
                        <span className={`text-lg font-bold ${progress === 100 ? 'text-emerald-600' : 'text-[var(--primary)]'}`}>{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} size="small" showLabel={false} animated={progress > 0 && progress < 100} color={progress === 100 ? 'success' : 'primary'} />
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{done} completed</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />{total - done} remaining</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/course/${course.id}`} className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"><Zap className="h-3 w-3" />Continue</Link>
                          {progress === 100 && (
                            <button onClick={() => { setSelectedCourseForCert(course); setShowNamePrompt(true) }} className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200">
                              <Download className="h-3 w-3" />Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium">No enrolled courses</p>
              <Link to="/courses" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Certificate Modal */}
        {showNamePrompt && selectedCourseForCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100"><Award className="h-6 w-6 text-amber-600" /></div>
              <h3 className="mb-2 text-lg font-bold">Generate Certificate</h3>
              <p className="mb-4 text-sm text-[var(--muted-foreground)]">Your name will appear on the certificate for <strong>{selectedCourseForCert.name}</strong></p>
              <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="mb-4 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="Enter your full name" autoFocus />
              <div className="flex gap-3">
                <button onClick={() => generateCertificate(selectedCourseForCert)} className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110">Generate</button>
                <button onClick={() => { setShowNamePrompt(false); setSelectedCourseForCert(null); setStudentName('') }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
