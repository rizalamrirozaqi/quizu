export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
      <div className="prose prose-stone dark:prose-invert">
        <p>Last updated: February 2026</p>
        
        <h3>1. Introduction</h3>
        <p>Welcome to <strong>Quizu</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>

        <h3>2. Data We Collect</h3>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul>
            <li><strong>Identity Data:</strong> includes username, or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address (via Authentication).</li>
            <li><strong>Technical Data:</strong> includes code submissions, execution results, and progress data.</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your data to:</p>
        <ul>
            <li>Manage your account and authentication via Supabase.</li>
            <li>Track your progress on learning roadmaps.</li>
            <li>Execute your code securely via our Judge System.</li>
        </ul>

        <h3>4. Data Security</h3>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.</p>
      </div>
    </div>
  );
}