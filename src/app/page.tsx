'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-900 to-slate-800 text-gray-100 overflow-x-hidden">
      {/* Subtle geometric background pattern */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        viewBox="0 0 800 800"
      >
        <defs>
          <pattern
            id="pattern-triangles"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <polygon points="20 0 40 40 0 40" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>
        <rect width="800" height="800" fill="url(#pattern-triangles)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col min-h-screen justify-center relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            Storebase — Your Ultimate Media Storage Solution
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-300">
            Secure, scalable, and blazing fast. Store, organize, and access all your media anywhere, anytime.
          </p>

          <div className="flex justify-center gap-6 mt-8">
            <a
              href="/login"
              className="inline-block rounded-full bg-indigo-600 px-8 py-3 text-white text-lg font-semibold shadow-md shadow-indigo-700/50 transition hover:bg-indigo-700"
              aria-label="Get started with Storebase"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="inline-block rounded-full border border-slate-400 px-8 py-3 text-slate-300 text-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition"
              aria-label="Explore features of Storebase"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
        >
          <FeatureCard
            title="Unlimited Storage"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M3 14h18M7 6h10M7 18h10"
                />
              </svg>
            }
            description="Never worry about running out of space. Store as many files as you need with our scalable cloud."
          />

          <FeatureCard
            title="Instant Access"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            description="Access your media files instantly from any device, anywhere in the world."
          />

          <FeatureCard
            title="Top-Notch Security"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v6m4-2v-2m-8 2v-2m6 6v-2m-4 2v-2"
                />
              </svg>
            }
            description="Your privacy matters. We employ advanced encryption and multi-layer protection."
          />
        </section>

        {/* CTA Section */}
        <section className="mt-32 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to take control of your media?
          </h2>
          <a
            href="/signup"
            className="inline-block px-10 py-4 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-md shadow-indigo-700/50 hover:bg-indigo-700 transition"
            aria-label="Sign up now"
          >
            Get Started Now
          </a>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-300 text-base max-w-xs">{description}</p>
    </div>
  );
}
