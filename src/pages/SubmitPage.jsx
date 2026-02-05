import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintForm } from '../components/ComplaintForm';
import { createComplaint } from '../services/complaintService';

export function SubmitPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const { trackingId } = await createComplaint(formData);
      navigate(`/confirmation/${trackingId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-black tracking-tighter text-center mb-2">
          Submit a Complaint
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your identity remains anonymous. No personal data is collected.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ComplaintForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
