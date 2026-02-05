import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ComplaintList } from '../components/ComplaintList';
import { listComplaints, updateComplaintStatus, addAdminNote } from '../services/complaintService';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      const data = await listComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    await updateComplaintStatus(id, status);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  async function handleNoteAdd(id, note) {
    await addAdminNote(id, note);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminNotes: note } : c))
    );
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">All Complaints</h2>
          <span className="text-sm text-gray-500">{complaints.length} total</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <ComplaintList
            complaints={complaints}
            onStatusChange={handleStatusChange}
            onNoteAdd={handleNoteAdd}
          />
        )}
      </main>
    </div>
  );
}
