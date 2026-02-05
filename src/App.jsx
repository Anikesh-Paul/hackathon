import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SubmitPage } from "./pages/SubmitPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/submit" replace />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route
            path="/confirmation/:trackingId"
            element={<ConfirmationPage />}
          />

          {/* Admin routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/submit" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
