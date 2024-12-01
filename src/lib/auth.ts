import NextAuth, { type Session } from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        token.username = profile.login;
      }
      return token;
    },
    async session({ session, token, user }) {
      if ("username" in token) {
        // @ts-ignore
        session.user.username = token.username;
      }
      return session;
    }
  }
})

export function getUsername(session: Session) {
  // @ts-ignore
  const username: string = session.user.username;
  if (!username) {
    throw new Error("No username found in session");
  }
  return username;
}