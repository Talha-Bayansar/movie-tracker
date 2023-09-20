import { component$ } from "@builder.io/qwik";
import { MovieCard } from "../components";
import { Star } from "~/shared";
import type { Genre, Movie } from "../models";

type Props = {
  movies?: Movie[];
  genres?: Genre[];
};

export const MovieGrid = component$(({ movies, genres }: Props) => {
  return (
    <div class="grid md:grid-cols-4 grid-cols-2 gap-8 place-content-center overflow-hidden">
      {movies?.map((movie) => (
        <MovieCard href={`/${movie.id}`} movie={movie} key={movie.id}>
          <div class="flex items-center gap-1 text-sm" q:slot="subtitle">
            <Star size={12} /> {movie.vote_average.toFixed(1)}
          </div>
          <div
            class="text-c-text-small min-w-0 max-w-full shrink-0 text-xs text-ellipsis whitespace-nowrap overflow-hidden"
            q:slot="footer"
          >
            {genres
              ?.filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => genre.name)
              .join(" | ")}
          </div>
        </MovieCard>
      ))}
    </div>
  );
});
