import type { APIContext } from 'astro';

type CookieOptions = Parameters<APIContext['cookies']['set']>[2];

const BASE_COOKIE_OPTIONS: CookieOptions = {
   path: '/',
   httpOnly: true,
   sameSite: 'strict',
   secure: import.meta.env.PROD,
};

function mergeOptions(overrides?: CookieOptions): CookieOptions {
   return {
      ...BASE_COOKIE_OPTIONS,
      ...overrides,
   };
}

export function setSecureCookie(context: APIContext, name: string, value: string, options?: CookieOptions): void {
   context.cookies.set(name, value, mergeOptions(options));
}

export function deleteSecureCookie(context: APIContext, name: string, options?: CookieOptions): void {
   context.cookies.delete(name, mergeOptions(options));
}
