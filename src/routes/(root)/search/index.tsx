import { component$, useSignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  Form,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import { type Movie, type Genre, MovieGrid } from "~/movies";
import { appTitle, fetchData, searchScreenDescription } from "~/utils";

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
  const loc = useLocation();
  const query = useSignal(loc.url.searchParams.get("q") ?? "");

  return (
    <div class="flex flex-col gap-8">
      <Form preventdefault:submit>
        <input
          name="q"
          placeholder="Search movie by title..."
          type="search"
          class="rounded-lg p-3 w-full text-c-background"
          bind:value={query}
        />
      </Form>
      {!movies.value ? (
        <div class="w-full grid place-items-center">
          Search your favorite movies.
        </div>
      ) : movies.value.movie.total_results > 0 ? (
        <MovieGrid
          movies={movies.value.movie.results}
          genres={movies.value.genre.genres}
        />
      ) : (
        <div class="w-full grid place-items-center">
          There were no results for the given title.
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: appTitle,
  meta: [
    {
      name: "description",
      content: searchScreenDescription,
    },
  ],
};
