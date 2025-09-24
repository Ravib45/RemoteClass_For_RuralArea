import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SmartAnalytics from './pages/SmartAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <StudentDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Teacher Dashboard */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <TeacherDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Analytics (optional) */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <SmartAnalytics />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Catch-all → back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
