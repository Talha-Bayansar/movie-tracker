import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { type Movie } from "../models";
import { getMediaUrl } from "~/utils";
import { twMerge } from "tailwind-merge";
import { Link } from "@builder.io/qwik-city";

type Props = {
  movie: Movie;
  href: string;
  class?: string;
  id?: string;
};

export const MovieCard = component$(
  ({ movie, class: className, href, id }: Props) => {
    const isTouching = useSignal(false);

    return (
      <Link
        href={href}
        id={id}
        onTouchStart$={() => (isTouching.value = true)}
        onTouchEnd$={() => (isTouching.value = false)}
        onTouchCancel$={() => (isTouching.value = false)}
        class={twMerge(
          "flex flex-col gap-1 min-w-[8rem] transition-transform",
          `${isTouching.value ? "scale-95" : "scale-100"}`,
          className
        )}
      >
        <Image
          class="w-full h-full object-cover rounded mb-3"
          width={160}
          height={240}
          src={getMediaUrl("w300", movie.poster_path)}
          alt={`Poster of the movie: ${movie.title}`}
        />
        <h3 class="block w-full shrink-0 whitespace-nowrap text-ellipsis overflow-hidden text-sm font-medium">
          {movie.title}
        </h3>
        <Slot name="subtitle" />
        <Slot name="footer" />
      </Link>
    );
  }
);
