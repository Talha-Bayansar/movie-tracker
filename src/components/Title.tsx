import { Slot, component$ } from "@builder.io/qwik";

export const Title = component$(() => {
  return (
    <h1>
      <Slot />
    </h1>
  );
});
