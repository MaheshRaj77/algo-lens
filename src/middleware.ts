export { auth as middleware } from '@/auth';

export const config = {
  // Protect all routes starting with /app
  // and apply to the /api/chat route as well.
  // NextAuth automatically redirects unauthenticated users to the signIn page defined in auth.ts
  matcher: ['/app/:path*', '/api/chat/:path*'],
};
