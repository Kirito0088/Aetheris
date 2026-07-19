"use server";

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/supabase";
import { redirect } from "next/navigation";
import { z } from "zod";

type PortalRole = Extract<Enums<"user_role">, "volunteer" | "venue_operator">;

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function loginWithRole(
  formData: FormData,
  expectedRole: PortalRole,
  redirectPath: string,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password } = parsed.data;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData?.user) {
    return { error: authError?.message || "Login failed." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== expectedRole) {
    // Do not leave a successfully authenticated user in a portal that their
    // role cannot access. The middleware remains the authoritative route guard.
    await supabase.auth.signOut();
    return { error: "Access denied for this portal." };
  }

  redirect(redirectPath);
}
