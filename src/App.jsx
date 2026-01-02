import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "./layouts/AdminLayout"
import PublicLayout from "./layouts/PublicLayout"
import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import ProjectCreate from "./pages/admin/ProjectCreate"
import ProjectDetails from "./pages/admin/ProjectDetails"
import ProjectEdit from "./pages/admin/ProjectEdit"
import EventRegistration from "./pages/public/EventRegistration"
import CheckRegistration from "./pages/public/CheckRegistration"
import RegistrationSuccess from "./pages/public/RegistrationSuccess"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<Dashboard />} />
          <Route path="projects/create" element={<ProjectCreate />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:id/edit" element={<ProjectEdit />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/admin/login" replace />} />
          <Route path="event/:id" element={<EventRegistration />} />
          <Route path="event/:id/check" element={<CheckRegistration />} />
          <Route path="success" element={<RegistrationSuccess />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
