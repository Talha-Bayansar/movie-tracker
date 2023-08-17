import { component$ } from "@builder.io/qwik";
import { SubTitle } from "~/shared/components";
import { MovieCard } from "../components";
import type { Genre, Movie } from "../models";
import { Star } from "~/shared/icons";

type Props = {
  title: string;
  movies: Movie[];
  genres: Genre[];
};

export const MovieSection = component$(({ title, movies, genres }: Props) => {
  return (
    <div class="flex flex-col">
      <SubTitle class="mb-4">{title}</SubTitle>
      <div class="flex gap-4 overflow-x-scroll">
        {movies.map((movie) => (
          <MovieCard key={`now_playing_${movie.id}`} movie={movie}>
            <div class="flex items-center gap-1 text-sm" q:slot="subtitle">
              <Star size={12} /> {movie.vote_average}
            </div>
            <div
              class="text-c-text-small text-xs text-ellipsis whitespace-nowrap overflow-hidden"
              q:slot="footer"
            >
              {genres
                .filter((genre) => movie.genre_ids.includes(genre.id))
                .map((genre) => genre.name)
                .join(" | ")}
            </div>
          </MovieCard>
        ))}
      </div>
    </div>
  );
});
