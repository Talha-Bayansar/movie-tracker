import { component$ } from "@builder.io/qwik";
import { Form, routeLoader$ } from "@builder.io/qwik-city";
import { MovieCard, type Movie, type Genre } from "~/movies";
import { Star } from "~/shared";
import { fetchData } from "~/utils";

type GenreResponse = {
  genres: Genre[];
};

type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

type ApiResponse = {
  movie: MovieResponse;
  genre: GenreResponse;
};

export const useMoviesByQuery = routeLoader$(async (event) => {
  const query = event.query.get("q");
  if (query) {
    const movie = await fetchData(
      event.env.get("MOVIE_READ_TOKEN") as string,
      `/search/movie`,
      {
        query: query,
      }
    );
    const genre = await fetchData(
      event.env.get("MOVIE_READ_TOKEN") as string,
      `/genre/movie/list`
    );
    return {
      genre,
      movie,
    } as ApiResponse;
  } else {
    return null;
  }
});

export default component$(() => {
  const movies = useMoviesByQuery();

  return (
    <div class="flex flex-col gap-8">
      <Form>
        <input
          name="q"
          placeholder="Search movie by title..."
          type="search"
          class="rounded-lg p-3 w-full text-c-background"
        />
      </Form>
      {!movies.value ? (
        <div class="w-full h-full grid place-items-center">
          Search your favorite movies.
        </div>
      ) : movies.value.movie.total_results > 0 ? (
        <div class="grid md:grid-cols-4 grid-cols-2 gap-8 place-content-center overflow-hidden">
          {movies.value.movie.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie}>
              <div class="flex items-center gap-1 text-sm" q:slot="subtitle">
                <Star size={12} /> {movie.vote_average.toFixed(1)}
              </div>
              <div
                class="text-c-text-small min-w-0 max-w-full text-xs text-ellipsis whitespace-nowrap overflow-hidden"
                q:slot="footer"
              >
                {movies.value.genre.genres
                  .filter((genre) => movie.genre_ids.includes(genre.id))
                  .map((genre) => genre.name)
                  .join(" | ")}
              </div>
            </MovieCard>
          ))}
        </div>
      ) : (
        <div class="w-full h-full grid place-items-center">
          There were no results for the given title.
        </div>
      )}
    </div>
  );
});
