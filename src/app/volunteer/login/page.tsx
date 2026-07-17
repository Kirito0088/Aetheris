"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginWithRole } from "@/app/actions/auth";

export default function VolunteerLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginWithRole(formData, "volunteer", "/volunteer");

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ffffff] p-4 font-sans sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-black">Sign in to Volunteer Portal</h1>
            <p className="mt-2 text-[15px] font-medium text-gray-500">Continue to Aetheris</p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] text-black transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] text-black transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-black px-4 py-3 text-[15px] font-medium text-white transition-all hover:bg-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
