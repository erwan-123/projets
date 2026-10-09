// proxy.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Chemins protégés : nécessitent une authentification
export const config = {
  matcher: ["/dashboard/:path*"],
};