'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // 1. Ambil user dulu
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nggak ada akses, Zal!" };

  // 2. Ambil data dari form
  const username = formData.get("username") as string;
  // Tambahkan field lain kalau ada, misal avatar_url

  try {
    // 3. Update ke tabel profiles
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) throw error;

    // 4. Refresh data di halaman profile & settings
    revalidatePath("/profile");
    revalidatePath("/settings");

    return { success: "Profil berhasil diperbarui!", error: null };
  } catch (err) {
    return { error: "Gagal update data, coba lagi ya.", success: null };
  }
}