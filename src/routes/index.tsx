import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { type Favorite, db, favorites } from "~/db";

export const useFavorites = routeLoader$(async () => {
  const response: Favorite[] = await db.select().from(favorites).all();
  return response;
});

export default component$(() => {
  const favorites = useFavorites();

  return (
    <>
      <h1>Hi 👋</h1>
      <p></p>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
