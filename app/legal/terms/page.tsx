export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
      <div className="prose prose-stone dark:prose-invert">
        <p>Last updated: February 2026</p>
        
        <h3>1. Agreement to Terms</h3>
        <p>By accessing our website <strong>Quizu</strong>, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.</p>

        <h3>2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Quizu's website for personal, non-commercial transitory viewing only.</p>

        <h3>3. Code of Conduct</h3>
        <p>You agree not to:</p>
        <ul>
            <li>Submit malicious code designed to crash or exploit our execution servers (Piston/Judge).</li>
            <li>Harass other users in the community or clans.</li>
            <li>Attempt to reverse engineer any part of the software.</li>
        </ul>

        <h3>4. Disclaimer</h3>
        <p>The materials on Quizu's website are provided on an 'as is' basis. Quizu makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
      </div>
    </div>
  );
}