import { useParams, Link } from "react-router-dom";

export function ConfirmationPage() {
  const { trackingId } = useParams();

  function copyToClipboard() {
    navigator.clipboard.writeText(trackingId);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-black tracking-tighter mb-2">
            Complaint Submitted
          </h1>
          <p className="text-gray-600 mb-6">
            Your complaint has been received and will be reviewed.
          </p>

          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Your Tracking ID</p>
            <code className="block text-sm font-mono bg-white border rounded px-3 py-2 break-all">
              {trackingId}
            </code>
            <button
              onClick={copyToClipboard}
              className="mt-2 text-sm text-gray-600 hover:text-black underline"
            >
              Copy to clipboard
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Save this ID to reference your complaint later.
          </p>

          <Link
            to="/submit"
            className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800"
          >
            Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
