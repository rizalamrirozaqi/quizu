'use client';

import { useActionState } from 'react';
import { updateProfile } from './actions'; // sesuaikan path-nya

interface Profile {
  id?: string;
  username: string;
  avatar_url?: string; // contoh kalau ada field lain
  // tambahkan field lain sesuai kebutuhan
}

// 2. Definisikan tipe Props untuk komponen ini
interface SettingsPageProps {
  profile: Profile | null;
}

export default function SettingsPage({ profile }: SettingsPageProps) {
  // Hook ini bakal nangkep return value dari action kamu
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* Tampilkan error kalau ada */}
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
          {state.error}
        </div>
      )}
      
      {/* Tampilkan success kalau ada */}
      {state?.success && (
        <div className="p-3 text-sm text-green-500 bg-green-500/10 rounded-lg">
          {state.success}
        </div>
      )}

      {/* Input field kamu tetap sama */}
      <input name="username" defaultValue={profile?.username} className="w-full px-3 py-2 border rounded-lg" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}