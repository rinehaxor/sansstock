import React, { useEffect, useRef, useState } from 'react';

interface UserMenuProps {
  email?: string;
}

export default function UserMenu({ email = '' }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full mb-3 p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 text-left"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white ring-opacity-30">
                <span className="text-lg font-bold text-white">{email ? email.charAt(0).toUpperCase() : 'A'}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{email || 'Admin'}</p>
            <p className="text-xs text-blue-200 truncate font-medium">User</p>
          </div>
          <svg className="ml-2 w-5 h-5 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 -top-2 translate-y-[-100%] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold truncate">{email || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{email || 'admin@example.com'}</p>
          </div>
          <div className="border-t">
            <a href="/dashboard/users" className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              User
            </a>
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={async () => {
                if (isLoggingOut) return;
                setIsLoggingOut(true);
                try {
                  const response = await fetch('/api/auth/signout', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  if (response.ok) {
                    window.location.href = '/portal/access';
                    return;
                  }
                  const error = await response.json().catch(() => null);
                  alert(error?.error || 'Failed to log out. Please try again.');
                } catch (err) {
                  console.error('Logout failed', err);
                  alert('Tidak bisa logout. Silakan coba lagi.');
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm text-red-600 disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






