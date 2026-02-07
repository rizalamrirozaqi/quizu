export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.0.0",
      date: "February 7, 2026",
      title: "Global Launch 🚀",
      description: "Quizu is officially live! We are starting with 50+ challenges across Python, JavaScript, and Go.",
      changes: [
        "Added Multiplayer Battle Mode (Beta)",
        "Integrated Piston for Code Execution",
        "Launched Global Leaderboard",
        "Dark Mode support"
      ]
    },
    {
      version: "v0.9.0",
      date: "January 20, 2026",
      title: "The Beta",
      description: "Initial testing phase with select users.",
      changes: [
        "Basic Code Editor with Monaco",
        "Supabase Authentication",
        "Learning Roadmaps"
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Changelog</h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-12">Latest updates and improvements to Quizu.</p>

      <div className="space-y-12 border-l border-gray-200 dark:border-zinc-800 ml-3 pl-8 relative">
        {updates.map((update, i) => (
            <div key={i} className="relative">
                {/* Dot */}
                <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-black bg-blue-500"></div>
                
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                        {update.version}
                    </span>
                    <span className="text-sm text-gray-400">{update.date}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{update.title}</h2>
                <p className="text-gray-600 dark:text-zinc-400 mb-4">{update.description}</p>
                
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                    {update.changes.map((change, idx) => (
                        <li key={idx}>{change}</li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
}