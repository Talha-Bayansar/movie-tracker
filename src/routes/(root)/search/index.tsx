import { $, component$, useSignal } from "@builder.io/qwik";
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

type MoviesByQueryResponse = {
  movies?: MovieResponse;
  query: string;
};

const fetchMoviesByQuery = async (
  token?: string,
  query?: string,
  page?: number
) => {
  if (query) {
    const movies = await fetchData(token ?? "", `/search/movie`, {
      query: query,
      page: page ?? 1,
    });

    return movies as MovieResponse;
  } else {
    return null;
  }
};

export const useGenres = routeLoader$(async (event) => {
  const genres = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/genre/movie/list`
  );
  return genres as GenreResponse;
});

export const useMoviesByQuery = routeLoader$(async (event) => {
  const query = event.query.get("q");
  const response = await fetchMoviesByQuery(
    event.env.get("MOVIE_READ_TOKEN") as string,
    query ?? undefined
  );
  return { movies: response, query } as MoviesByQueryResponse;
});

export default component$(() => {
  const moviesByQuery = useMoviesByQuery();
  const genres = useGenres();
  const { value: token } = useToken();
  const loc = useLocation();
  const query = useSignal(loc.url.searchParams.get("q") ?? "");
  const movies = useSignal<MovieResponse | null | undefined>(
    moviesByQuery.value.movies
  );

  const handleEnd = $(
    async (
      currentValue: MovieResponse | undefined | null,
      loadFn: (
        token?: string,
        query?: string,
        page?: number
      ) => Promise<MovieResponse | null | undefined>
    ) => {
      const response = await loadFn(
        token,
        moviesByQuery.value.query,
        currentValue?.page ? currentValue.page + 1 : undefined
      );
      if (response && currentValue?.results) {
        return {
          ...response,
          results: [...currentValue.results, ...response.results],
        };
      } else return null;
    }
  );

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
      ) : movies.value.total_results > 0 ? (
        <MovieGrid
          movies={movies.value.results}
          genres={genres.value.genres}
          onEnd$={async () => {
            if (movies.value?.page !== movies.value?.total_pages) {
              const response = await handleEnd(
                movies.value,
                fetchMoviesByQuery
              );
              movies.value = response;
            }
          }}
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

export const useToken = routeLoader$((event) => {
  return event.env.get("MOVIE_READ_TOKEN");
});
