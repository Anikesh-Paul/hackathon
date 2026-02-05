import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { SubmitPage } from "./pages/SubmitPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { TrackStatusPage } from "./pages/TrackStatusPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/submit" replace />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route
                path="/confirmation/:trackingId"
                element={<ConfirmationPage />}
              />
              <Route path="/track" element={<TrackStatusPage />} />

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
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
