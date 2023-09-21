import {
  type PropFunction,
  component$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { SubTitle } from "~/shared/components";
import { MovieCard } from "../components";
import type { Genre, Movie } from "../models";
import { Star } from "~/shared/icons";

type Props = {
  title: string;
  movies?: Movie[];
  onEnd$: PropFunction<() => Promise<void>>;
  genres?: Genre[];
};

export const MovieSection = component$(
  ({ title, movies, genres, onEnd$ }: Props) => {
    useVisibleTask$(async (taskCtx) => {
      if (movies && movies.length > 0) {
        taskCtx.track(() => movies);
        const end = document.querySelector(
          `#${title.replaceAll(" ", "_")}_${movies[movies.length - 5].id}`
        );
        if (end) {
          // Set up infinite scroll
          const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
              // Load more items when the sentinel comes into view
              try {
                await onEnd$();
              } catch (error) {
                throw Error();
              }
            }
          });

          // Start observing the sentinel
          observer.observe(end);

          taskCtx.cleanup(() => {
            observer.disconnect();
          });
        }
      }
    });

    return (
      <div class="flex flex-col">
        <SubTitle class="mb-4">{title}</SubTitle>
        <div class="flex gap-4 overflow-x-scroll mx-[-1.5rem]">
          {movies?.map((movie) => (
            <MovieCard
              id={`${title.replaceAll(" ", "_")}_${movie.id}`}
              href={`/${movie.id}`}
              key={`${title}_${movie.id}`}
              movie={movie}
              class="w-32 first:ml-6"
            >
              <div class="flex items-center gap-1 text-sm" q:slot="subtitle">
                <Star size={12} /> {movie.vote_average}
              </div>
              <div
                class="text-c-text-small text-xs text-ellipsis shrink-0 whitespace-nowrap overflow-hidden"
                q:slot="footer"
              >
                {genres
                  ?.filter((genre) => movie.genre_ids.includes(genre.id))
                  .map((genre) => genre.name)
                  .join(" | ")}
              </div>
            </MovieCard>
          ))}
          {movies?.length && movies.length > 0 && (
            <div id={`endOf${title}`} class="pr-2" />
          )}
        </div>
      </div>
    );
  }
);
