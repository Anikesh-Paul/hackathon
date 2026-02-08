# Whistleblower Portal — Secure Anonymous Reporting

A professional, feature-complete whistleblower platform designed to empower individuals to report misconduct safely and anonymously. Built with a focus on privacy, security, and ease of use, the platform bridges the gap between whistleblowers and investigators without ever requiring personal identification.

## 🚀 Key Features

- **Anonymous Complaint Submission**: Report incidents without creating an account or providing identifying information.
- **Secure Tracking ID**: Every report is assigned a unique UUID tracking identifier for private status monitoring.
- **Human-Readable Recovery Phrases**: A 4-word mnemonic phrase (e.g., `falcon-mesa-glacier-torch`) allows users to recover their tracking ID if lost.
- **Multi-Format Evidence Support**: Securely upload images, PDFs, audio (MP3), and video (MP4) as evidence.
- **Dynamic Status Tracking**: Real-time updates on investigation progress (Pending → Reviewing → Resolved/Dismissed).
- **Public & Private Communication**: Investigators can post public updates for the whistleblower while maintaining internal notes.
- **Mobile-Responsive Interface**: Fully optimized for both desktop and mobile devices for reports on the go.

## 🛡️ How Anonymity & Privacy Work

Privacy is the core foundation of this platform. We employ several high-level mechanisms to protect our users:

- **Zero-Account Architecture**: No sign-up or login process exists for whistleblowers, preventing identity-report linkage.
- **Metadata Stripping**: The system is designed to treat all incoming data as sensitive and strips common identifying headers.
- **No IP Logging**: The application layer does not log or store user IP addresses or browser fingerprints.
- **Tracking ID Access**: The Tracking ID is the _only_ key to access a report's status. It is generated client-side and known only to the user.
- **One-Way Note Visibility**: Admin internal notes remain strictly internal; only explicit "Public Messages" are visible to the reporter.

## 📝 How to Use the Platform

Testing the platform is straightforward and secure:

1.  **Submit a Complaint**: Navigate to the "Submit Report" page and fill in the details.
2.  **Save Your Credentials**: Upon submission, you will be presented with a **Tracking ID** and a **Recovery Phrase**. **Copy these immediately**, as they cannot be shown again.
3.  **Upload Evidence**: Add relevant files to support your report.
4.  **Track Status**: Use your Tracking ID on the "Track Status" page to see updates from investigators and message history.
5.  **Recover Access**: If you lose your Tracking ID, use the recovery tool with your 4-word phrase to retrieve it.

## 📁 File Upload Rules

To ensure system stability and security, the following limits apply:

- **Quantity**: Maximum of 3 files per complaint.
- **Size**: Maximum of 5 MB per individual file.
- **Formats**:
  - **Images**: `.jpg`, `.png`, `.webp`
  - **Documents**: `.pdf`
  - **Audio**: `.mp3`
  - **Video**: `.mp4`

## ⚖️ Admin Functionality

The platform includes a secure administrative dashboard where authorized investigators can:

- Review incoming reports in an organized queue.
- Update tracking statuses as the investigation progresses.
- Communicate with whistleblowers via public status messages.
- Maintain internal investigator notes for case management.
- _Note: Admin accounts are managed via Appwrite Auth and are not accessible to public users._

## 📱 Mobile & Responsiveness

The portal is built with a mobile-first philosophy using Tailwind CSS. Whether you are using a widescreen monitor or a smartphone, the UI adapts to provide a clear, professional, and accessible experience.

## ⚠️ Testing Notice / Disclaimer

This platform is currently in a **Public Testing Phase**.

- **Data Sensitivity**: Please do **not** submit real sensitive, personal, or classified information during testing.
- **Data Persistence**: As this is a testing environment, the database may be reset periodically.
- **Intended Use**: This software is provided as-is for demonstration and evaluation purposes.

## 💻 Tech Stack

- **Frontend**: [React](https://reactjs.org/) (JavaScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend-as-a-Service**: [Appwrite](https://appwrite.io/) (Database, Storage, Authentication)
- **Deployment**: Live on custom domain (Appwrite Cloud Infrastructure)

## 🛠️ Local Development

To run this project locally for development or review:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/whistleblower-portal.git
    cd whistleblower-portal
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `src/config.js` (or use the existing one) and point it to your Appwrite project instance.
4.  **Start development server**:
    ```bash
    npm run dev
    ```

_Note: A functioning Appwrite instance with the correct Collections (Complaints, Status History, Follow-ups) and Storage Bucket is required for full functionality._

## 💬 Feedback & Contributions

We welcome feedback from testers and reviewers!

- Found a bug? Open an **Issue**.
- Have a suggestion? Start a **Discussion**.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
