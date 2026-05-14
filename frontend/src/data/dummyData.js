// ─── Dummy Data for SmartStudyHub ───────────────────────────────────────────

// ─── Users ──────────────────────────────────────────────────────────────────

// export const initialUsers = [
//   {
//     id: 1,
//     name: 'Rahul Sharma',
//     email: 'student@smartstudyhub.com',
//     password: 'student123',
//     role: 'STUDENT',
//     avatar: null,
//     joinedDate: '2025-09-15',
//     bio: 'Passionate learner focused on full-stack development and data structures.',
//     phone: '+91 9876543210',
//     location: 'Pune, India',
//   },
//   {
//     id: 2,
//     name: 'Prof. James Miller',
//     email: 'teacher@smartstudyhub.com',
//     password: 'teacher123',
//     role: 'TEACHER',
//     avatar: null,
//     joinedDate: '2024-06-01',
//     bio: 'Senior developer with 10+ years experience. Teaching Java, React, and DSA.',
//     phone: '+1 555-234-5678',
//     location: 'San Francisco, USA',
//   },
//   {
//     id: 3,
//     name: 'Admin User',
//     email: 'admin@smartstudyhub.com',
//     password: 'admin123',
//     role: 'ADMIN',
//     avatar: null,
//     joinedDate: '2024-01-01',
//     bio: 'Platform administrator.',
//     phone: '+1 555-000-0000',
//     location: 'New York, USA',
//   },
//   {
//     id: 4,
//     name: 'Emily Watson',
//     email: 'emily@smartstudyhub.com',
//     password: 'emily123',
//     role: 'TEACHER',
//     avatar: null,
//     joinedDate: '2025-01-10',
//     bio: 'Data Science educator and Python enthusiast.',
//     phone: '+44 7700 123456',
//     location: 'London, UK',
//   },
//   {
//     id: 5,
//     name: 'Priya Patel',
//     email: 'priya@smartstudyhub.com',
//     password: 'priya123',
//     role: 'STUDENT',
//     avatar: null,
//     joinedDate: '2025-11-20',
//     bio: 'Computer Science student exploring databases and backend.',
//     phone: '+91 9123456789',
//     location: 'Mumbai, India',
//   },
// ]

// ─── Courses ────────────────────────────────────────────────────────────────

export const courses = [
  {
    id: 1,
    name: 'Data Structures & Algorithms',
    description: 'Master DSA from scratch with comprehensive tutorials and practice problems.',
    instructor: 'Prof. James Miller',
    instructorId: 2,
    thumbnail: null,
    totalVideos: 5,
    level: 'Intermediate',
    category: 'Computer Science',
    duration: '24 hrs',
    featured: true,
    students: 1245,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Java Programming',
    description: 'Complete Java course covering OOP, collections, multithreading, and advanced concepts.',
    instructor: 'Prof. James Miller',
    instructorId: 2,
    thumbnail: null,
    totalVideos: 3,
    level: 'Beginner',
    category: 'Programming',
    duration: '18 hrs',
    featured: true,
    students: 2340,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Database Management System',
    description: 'SQL and DBMS concepts including normalization, transactions, indexing, and query optimization.',
    instructor: 'Prof. James Miller',
    instructorId: 2,
    thumbnail: null,
    totalVideos: 3,
    level: 'Intermediate',
    category: 'Database',
    duration: '15 hrs',
    featured: false,
    students: 890,
    rating: 4.5,
  },
  {
    id: 4,
    name: 'React.js Masterclass',
    description: 'Build modern web applications with React, hooks, context, routing, and state management.',
    instructor: 'Prof. James Miller',
    instructorId: 2,
    thumbnail: null,
    totalVideos: 4,
    level: 'Intermediate',
    category: 'Web Development',
    duration: '20 hrs',
    featured: true,
    students: 1890,
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Python for Data Science',
    description: 'Learn Python with NumPy, Pandas, Matplotlib, and machine learning fundamentals.',
    instructor: 'Emily Watson',
    instructorId: 4,
    thumbnail: null,
    totalVideos: 3,
    level: 'Beginner',
    category: 'Data Science',
    duration: '22 hrs',
    featured: false,
    students: 1560,
    rating: 4.6,
  },
]

// ─── Playlists (Videos) ─────────────────────────────────────────────────────

export const playlists = [
  // DSA Course (id: 1)
  { id: 1, courseId: 1, title: 'Introduction to DSA', youtubeUrl: 'https://www.youtube.com/watch?v=8hly31xKli0', level: 'Beginner', duration: '45 min', order: 1 },
  { id: 2, courseId: 1, title: 'Arrays and Strings', youtubeUrl: 'https://www.youtube.com/watch?v=QJNwK2uJyGs', level: 'Beginner', duration: '1 hr 10 min', order: 2 },
  { id: 3, courseId: 1, title: 'Linked Lists Deep Dive', youtubeUrl: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I', level: 'Intermediate', duration: '1 hr 30 min', order: 3 },
  { id: 4, courseId: 1, title: 'Trees and Graphs', youtubeUrl: 'https://www.youtube.com/watch?v=oSWTXtMglKE', level: 'Intermediate', duration: '2 hr', order: 4 },
  { id: 5, courseId: 1, title: 'Dynamic Programming', youtubeUrl: 'https://www.youtube.com/watch?v=oBt53YbR9Kk', level: 'Advanced', duration: '2 hr 15 min', order: 5 },

  // Java Course (id: 2)
  { id: 6, courseId: 2, title: 'Java Basics', youtubeUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34', level: 'Beginner', duration: '1 hr 45 min', order: 1 },
  { id: 7, courseId: 2, title: 'OOP Concepts', youtubeUrl: 'https://www.youtube.com/watch?v=pTB0EiLXUC8', level: 'Intermediate', duration: '1 hr 20 min', order: 2 },
  { id: 8, courseId: 2, title: 'Java Collections', youtubeUrl: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4', level: 'Advanced', duration: '1 hr 50 min', order: 3 },

  // DBMS Course (id: 3)
  { id: 9, courseId: 3, title: 'SQL Fundamentals', youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', level: 'Beginner', duration: '2 hr', order: 1 },
  { id: 10, courseId: 3, title: 'Joins and Subqueries', youtubeUrl: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw', level: 'Intermediate', duration: '1 hr 30 min', order: 2 },
  { id: 11, courseId: 3, title: 'Database Design', youtubeUrl: 'https://www.youtube.com/watch?v=ztHopE5Wnpc', level: 'Advanced', duration: '1 hr 45 min', order: 3 },

  // React Course (id: 4)
  { id: 12, courseId: 4, title: 'React Fundamentals', youtubeUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', level: 'Beginner', duration: '2 hr', order: 1 },
  { id: 13, courseId: 4, title: 'React Hooks Deep Dive', youtubeUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', level: 'Intermediate', duration: '1 hr 45 min', order: 2 },
  { id: 14, courseId: 4, title: 'React Router & Navigation', youtubeUrl: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU', level: 'Intermediate', duration: '1 hr 20 min', order: 3 },
  { id: 15, courseId: 4, title: 'State Management Patterns', youtubeUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', level: 'Advanced', duration: '2 hr 10 min', order: 4 },

  // Python Course (id: 5)
  { id: 16, courseId: 5, title: 'Python Basics', youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', level: 'Beginner', duration: '3 hr', order: 1 },
  { id: 17, courseId: 5, title: 'NumPy & Pandas', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', level: 'Intermediate', duration: '2 hr 30 min', order: 2 },
  { id: 18, courseId: 5, title: 'Data Visualization', youtubeUrl: 'https://www.youtube.com/watch?v=UO98lJQ3QGI', level: 'Intermediate', duration: '1 hr 45 min', order: 3 },
]

// ─── Enrollments (which student enrolled in which course) ───────────────────

export const initialEnrollments = [
  { userId: 1, courseId: 1 },
  { userId: 1, courseId: 2 },
  { userId: 1, courseId: 4 },
  { userId: 5, courseId: 1 },
  { userId: 5, courseId: 3 },
  { userId: 5, courseId: 5 },
]

// ─── Recent Activity ────────────────────────────────────────────────────────

export const recentActivity = [
  { id: 1, playlistId: 3, action: 'Watched', timestamp: '2026-04-21T12:30:00', courseId: 1 },
  { id: 2, playlistId: 7, action: 'Completed', timestamp: '2026-04-21T10:15:00', courseId: 2 },
  { id: 3, playlistId: 12, action: 'Watched', timestamp: '2026-04-20T16:45:00', courseId: 4 },
  { id: 4, playlistId: 9, action: 'Completed', timestamp: '2026-04-20T14:00:00', courseId: 3 },
  { id: 5, playlistId: 16, action: 'Started', timestamp: '2026-04-19T09:30:00', courseId: 5 },
]

// Initial completed playlists (for progress tracking)
export const initialCompletedIds = [1, 2, 6, 7, 9]

// ─── Certificates ───────────────────────────────────────────────────────────

export const initialCertificates = [
  {
    id: 1,
    userId: 1,
    courseId: 2,
    courseName: 'Java Programming',
    issuedDate: '2026-03-15',
    certId: 'CERT-JAVA-2026-A1B2',
  },
]

// ─── Flagged / Reported Videos ──────────────────────────────────────────────

export const initialReports = [
  {
    id: 1,
    playlistId: 5,
    reportedBy: 1,
    reason: 'Audio quality is very poor',
    status: 'pending', // pending | approved | removed
    timestamp: '2026-04-18T10:00:00',
  },
  {
    id: 2,
    playlistId: 8,
    reportedBy: 5,
    reason: 'Content is outdated and uses deprecated API',
    status: 'pending',
    timestamp: '2026-04-19T14:30:00',
  },
  {
    id: 3,
    playlistId: 15,
    reportedBy: 1,
    reason: 'Video contains misleading information about Redux',
    status: 'pending',
    timestamp: '2026-04-20T09:15:00',
  },
]

// ─── Color Utilities ────────────────────────────────────────────────────────

export const categoryColors = {
  'Computer Science': { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  'Programming': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'Database': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Web Development': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'Data Science': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
}

export const levelColors = {
  Beginner: { bg: 'bg-green-100', text: 'text-green-700' },
  Intermediate: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Advanced: { bg: 'bg-red-100', text: 'text-red-700' },
}

export const roleBadgeColors = {
  STUDENT: { bg: 'bg-blue-100', text: 'text-blue-700' },
  TEACHER: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  ADMIN: { bg: 'bg-red-100', text: 'text-red-700' },
}
