'use client';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-300 py-4 text-center text-sm text-slate-600">
      &copy; {new Date().getFullYear()} Storebase. All rights reserved.
    </footer>
  );
}
