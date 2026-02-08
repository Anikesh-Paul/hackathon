import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { AdminNavbar } from "./components/AdminNavbar";
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
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-12">
                    <Navigate to="/submit" replace />
                  </main>
                </>
              }
            />
            <Route
              path="/submit"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-12">
                    <SubmitPage />
                  </main>
                </>
              }
            />
            <Route
              path="/confirmation/:trackingId"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-12">
                    <ConfirmationPage />
                  </main>
                </>
              }
            />
            <Route
              path="/track"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-12">
                    <TrackStatusPage />
                  </main>
                </>
              }
            />

            {/* Admin routes */}
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-24 pb-12">
                    <LoginPage />
                  </main>
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminNavbar />
                  <main className="flex-grow pt-24 pb-12">
                    <DashboardPage />
                  </main>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/submit" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
