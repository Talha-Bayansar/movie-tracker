import { component$, Slot } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { type Movie } from "../models";
import { getMediaUrl } from "~/utils";
import { twMerge } from "tailwind-merge";

type Props = {
  movie: Movie;
  class?: string;
};

export const MovieCard = component$(({ movie, class: className }: Props) => {
  return (
    <div class={twMerge("flex flex-col gap-1 min-w-[8rem]", className)}>
      <Image
        class="w-32 h-48 object-cover rounded mb-3"
        width={160}
        height={240}
        src={getMediaUrl("w200", movie.poster_path)}
        alt={`Poster of the movie: ${movie.title}`}
      />
      <h3 class="block w-full whitespace-nowrap text-ellipsis overflow-hidden text-sm font-medium">
        {movie.title}
      </h3>
      <Slot name="subtitle" />
      <Slot name="footer" />
    </div>
  );
});
