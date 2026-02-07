import { CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 text-green-600">
        <CheckCircle2 size={40} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Systems Operational</h1>
      <p className="text-gray-500 mb-12">Last updated: Just now</p>

      <div className="space-y-4 text-left">
          <StatusItem name="Web Application" status="Operational" />
          <StatusItem name="Judge Engine (Piston)" status="Operational" />
          <StatusItem name="Database (Supabase)" status="Operational" />
          <StatusItem name="Authentication API" status="Operational" />
      </div>
    </div>
  );
}

function StatusItem({ name, status }: { name: string; status: string }) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900/50">
            <span className="font-medium text-gray-900 dark:text-white">{name}</span>
            <span className="flex items-center gap-2 text-sm text-green-600 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {status}
            </span>
        </div>
    )
}