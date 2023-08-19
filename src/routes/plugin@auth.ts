import { serverAuth$ } from "@builder.io/qwik-auth";
import Email from "@auth/core/providers/email";
import type { Provider } from "@auth/core/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/db";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get("AUTH_SECRET"),
    adapter: DrizzleAdapter(db),
    trustHost: true,
    providers: [
      Email({
        server: env.get("EMAIL_SERVER"),
        from: env.get("EMAIL_FROM"),
      }),
    ] as Provider[],
    pages: {
      signIn: "/sign-in",
    },
  }));
