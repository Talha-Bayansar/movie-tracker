import { component$, Slot } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { type Movie } from "../models";
import { getMediaUrl } from "~/utils";

type Props = {
  movie: Movie;
};

export const MovieCard = component$(({ movie }: Props) => {
  return (
    <div class="flex flex-col gap-1 min-w-[8rem]">
      <Image
        class="w-32 h-48 object-cover rounded mb-3"
        width={160}
        height={240}
        src={getMediaUrl("w200", movie.poster_path)}
        alt="Profile picture"
      />
      <h3 class="block w-full whitespace-nowrap text-ellipsis overflow-hidden text-sm font-medium">
        {movie.title}
      </h3>
      <Slot name="subtitle" />
      <Slot name="footer" />
    </div>
  );
});