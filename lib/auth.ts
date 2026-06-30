import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { nextCookies } from "better-auth/next-js";

// Only register Google when its credentials are configured, so the rest of
// auth keeps working before you add the keys. Set GOOGLE_CLIENT_ID and
// GOOGLE_CLIENT_SECRET in .env to enable the "Continue with Google" button.
const googleProvider =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
              google: {
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              },
          }
        : {};

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,

            mapProfileToUser: async (profile) => ({
                email: profile.email ?? `${profile.id}@users.noreply.github.com`,
                name: profile.name ?? profile.login,
            })
        },
        ...googleProvider,
    },

    plugins: [nextCookies()]
});
