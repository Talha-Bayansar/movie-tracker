import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignout } from ".././plugin@auth";
import { Image } from "@unpic/qwik";
import { URLS } from "~/utils/constants";
import type { Session } from "@auth/core/types";
import { type RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (event) => {
  const session: Session | null = event.sharedMap.get("session");

  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(
      302,
      `${URLS.SIGN_IN}?callbackUrl=${encodeURIComponent(event.url.href)}`
    );
  }
};

export default component$(() => {
  const session = useAuthSession();
  const signOut = useAuthSignout();

  return (
    <>
      <header class="flex justify-between items-center p-4 border border-green-600">
        <div class="flex flex-col">
          <span>{session.value?.user?.email}</span>
          <span>{session.value?.user?.name}</span>
        </div>
        {session.value ? (
          <button
            class="rounded-[50%] overflow-clip w-12 h-12"
            onClick$={async () =>
              await signOut.submit({
                callbackUrl: URLS.SIGN_IN,
              })
            }
          >
            <Image
              src={session.value.user?.image ?? "https://placehold.co/200x200"}
              aspectRatio={1}
              width={200}
              alt="Profile picture"
            />
          </button>
        ) : (
          <Link href={URLS.SIGN_IN}>Sign in</Link>
        )}
      </header>
      <div class="flex-grow overflow-y-scroll p-4">
        <Slot />
      </div>
    </>
  );
});
