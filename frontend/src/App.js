import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import StudyBuddiesPage from './pages/StudyBuddiesPage';
import EventsPage from './pages/EventsPage';
import SavedEventsPage from './pages/SavedEventsPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container py-4 min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-buddies"
            element={
              <ProtectedRoute>
                <StudyBuddiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-events"
            element={
              <ProtectedRoute>
                <SavedEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <StudyGroupsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/add"
            element={
              <AdminRoute>
                <AddEventPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/edit/:id"
            element={
              <AdminRoute>
                <EditEventPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
