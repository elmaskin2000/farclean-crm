import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/companies/:path*',
    '/contacts/:path*',
    '/pipeline/:path*',
    '/quotations/:path*',
    '/products/:path*',
    '/activities/:path*',
    '/tasks/:path*',
    '/campaigns/:path*',
    '/reports/:path*',
    '/documents/:path*',
    '/notifications/:path*',
    '/settings/:path*',
  ],
}
