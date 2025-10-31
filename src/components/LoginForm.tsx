import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Validation schema
const loginSchema = z.object({
   email: z.string().email('Email tidak valid'),
   password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
   });

   const onSubmit = async (data: LoginFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
         const formData = new FormData();
         formData.append('email', data.email);
         formData.append('password', data.password);

         const response = await fetch('/api/auth/signin', {
            method: 'POST',
            body: formData,
            credentials: 'include',
         });

         if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
         }

         // Redirect ke dashboard setelah berhasil
         window.location.href = '/dashboard';
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
