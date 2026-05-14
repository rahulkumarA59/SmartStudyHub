import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import { ProtectedRoute, RoleBasedGuard, GuestRoute } from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'

// Student Pages
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import MyLearning from './pages/MyLearning'

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherCourses from './pages/TeacherCourses'
import CreateCourse from './pages/CreateCourse'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import ManageUsers from './pages/ManageUsers'
import ManageCourses from './pages/ManageCourses'
import ContentModeration from './pages/ContentModeration'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes (no navbar/footer) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Protected Routes (with navbar/footer) */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Redirect root based on role handled via Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Common */}
            <Route path="courses" element={<Courses />} />
            <Route path="course/:id" element={<CourseDetail />} />

            {/* Student Routes */}
            <Route path="dashboard" element={<RoleBasedGuard allowedRoles={['STUDENT']}><Dashboard /></RoleBasedGuard>} />
            <Route path="progress" element={<RoleBasedGuard allowedRoles={['STUDENT']}><Progress /></RoleBasedGuard>} />
            <Route path="profile" element={<RoleBasedGuard allowedRoles={['STUDENT']}><Profile /></RoleBasedGuard>} />
            <Route path="my-learning" element={<RoleBasedGuard allowedRoles={['STUDENT']}><MyLearning /></RoleBasedGuard>} />

            {/* Teacher Routes */}
            <Route path="teacher/dashboard" element={<RoleBasedGuard allowedRoles={['TEACHER']}><TeacherDashboard /></RoleBasedGuard>} />
            <Route path="teacher/courses" element={<RoleBasedGuard allowedRoles={['TEACHER']}><TeacherCourses /></RoleBasedGuard>} />
            <Route path="teacher/create-course" element={<RoleBasedGuard allowedRoles={['TEACHER']}><CreateCourse /></RoleBasedGuard>} />

            {/* Admin Routes */}
            <Route path="admin/dashboard" element={<RoleBasedGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedGuard>} />
            <Route path="admin/users" element={<RoleBasedGuard allowedRoles={['ADMIN']}><ManageUsers /></RoleBasedGuard>} />
            <Route path="admin/courses" element={<RoleBasedGuard allowedRoles={['ADMIN']}><ManageCourses /></RoleBasedGuard>} />
            <Route path="admin/moderation" element={<RoleBasedGuard allowedRoles={['ADMIN']}><ContentModeration /></RoleBasedGuard>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
