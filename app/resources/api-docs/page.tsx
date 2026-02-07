import { Terminal } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Terminal size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="lead">
          Welcome to the Quizu API documentation. Currently, our API is <strong>private</strong> and used internally for the Quizu web application.
        </p>

        <h3>Base URL</h3>
        <pre className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg">
          <code>https://quizu.com/api/v1</code>
        </pre>

        <h3>Endpoints Overview</h3>
        <p>Below are the core resources available in the Quizu ecosystem:</p>

        <div className="grid md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <div className="font-mono text-sm font-bold text-green-600">GET /challenges</div>
                <p className="text-sm text-gray-500 mt-1">Retrieve a list of coding problems.</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <div className="font-mono text-sm font-bold text-blue-600">POST /judge/execute</div>
                <p className="text-sm text-gray-500 mt-1">Run code against test cases (Piston).</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <div className="font-mono text-sm font-bold text-yellow-600">GET /users/:id/stats</div>
                <p className="text-sm text-gray-500 mt-1">Get user ranking and heatmap.</p>
            </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 m-0">
                <strong>Note:</strong> Public access tokens are currently in closed beta. Please contact support if you need access for integrations.
            </p>
        </div>
      </div>
    </div>
  );
}