export default function CookiePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Cookie Policy</h1>
      <div className="prose prose-stone dark:prose-invert">
        <p>Last updated: February 2026</p>
        
        <h3>1. What are cookies?</h3>
        <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.</p>

        <h3>2. How do we use cookies?</h3>
        <p>We use cookies for the following purposes:</p>
        <ul>
            <li><strong>Authentication:</strong> To keep you logged in (via Supabase Auth).</li>
            <li><strong>Preferences:</strong> To remember your theme (Dark/Light mode).</li>
            <li><strong>Analytics:</strong> To understand how you interact with our website (if applicable).</li>
        </ul>

        <h3>3. Managing Cookies</h3>
        <p>You can change your cookie preferences any time by changing your browser settings. However, blocking essential cookies (like Authentication) may prevent the app from working correctly.</p>
      </div>
    </div>
  );
}