import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { appDescription, appTitle } from "~/utils";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
    </>
  );
});

export const head: DocumentHead = {
  title: appTitle,
  meta: [
    {
      name: "description",
      content: appDescription,
    },
  ],
};
