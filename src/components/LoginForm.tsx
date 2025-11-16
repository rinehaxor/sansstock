import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useEffect, useState } from 'react';

const CSRF_STORAGE_KEY = 'sansstocks.csrfToken';

// Validation schema
const loginSchema = z.object({
   email: z.string().email('Email tidak valid'),
   password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [csrfToken, setCsrfToken] = useState<string | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
   });

   const fetchCsrfToken = useCallback(async () => {
      try {
         const response = await fetch('/api/auth/csrf-token', {
            method: 'GET',
            credentials: 'include',
         });

         if (!response.ok) {
            throw new Error('Gagal mengambil CSRF token');
         }

         const { csrfToken: token } = (await response.json()) as { csrfToken: string };
         setCsrfToken(token);
         try {
            localStorage.setItem(CSRF_STORAGE_KEY, token);
         } catch {
            // Ignore storage errors (e.g., private mode)
         }
         return token;
      } catch (err) {
         console.error('Failed to fetch CSRF token', err);
         throw err;
      }
   }, []);

   useEffect(() => {
      fetchCsrfToken().catch(() => {
         setError('Gagal menyiapkan proteksi keamanan. Refresh halaman dan coba lagi.');
      });
   }, [fetchCsrfToken]);

   const onSubmit = async (data: LoginFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
         const token = csrfToken || (await fetchCsrfToken());
         const formData = new FormData();
         formData.append('email', data.email);
         formData.append('password', data.password);

         const response = await fetch('/api/auth/signin', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
               'X-CSRF-Token': token,
            },
         });

         if (!response.ok) {
            if (response.status === 403) {
               await fetchCsrfToken();
               throw new Error('Sesi keamanan kedaluwarsa. Silakan coba lagi.');
            }
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || 'Login gagal';
            throw new Error(errorMessage);
         }

         const result = await response.json();
         if (result.csrfToken) {
            setCsrfToken(result.csrfToken);
            try {
               localStorage.setItem(CSRF_STORAGE_KEY, result.csrfToken);
            } catch {
               // ignore
            }
         }

         // Redirect ke dashboard setelah berhasil
         // Gunakan replace untuk menghindari back button ke login page
         if (result.success && result.redirect) {
            window.location.replace(result.redirect);
         } else {
            window.location.replace('/dashboard');
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login');
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* Email Field */}
         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
               Email Address
            </label>
            <input
               id="email"
               type="email"
               autoComplete="email"
               {...register('email')}
               className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
         </div>

         {/* Password Field */}
         <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
               Password
            </label>
            <input
               id="password"
               type="password"
               autoComplete="current-password"
               {...register('password')}
               className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
         </div>

         {/* Error Message */}
         {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}

         {/* Submit Button */}
         <div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
               {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
         </div>
      </form>
   );
}
