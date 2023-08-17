import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { type Movie, MovieSection } from "~/movies";
import { appDescription, appTitle, fetchData } from "~/utils";
import { addMonths, startOfToday } from "date-fns";
import { type Genre } from "~/movies/models/genre";

type GenreResponse = {
  genres: Genre[];
};

type Dates = {
  maximum: string;
  minimum: string;
};

type ApiResponse = {
  dates: Dates;
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export const useNowPlayingMovies = routeLoader$(async (event) => {
  const pageNumber = event.query.get("page");
  const today = startOfToday();
  const response = await fetchData(`/discover/movie`, {
    page: pageNumber ?? 1,
    include_adult: false,
    include_video: false,
    sort_by: "popularity.desc",
    with_release_type: "2|3",
    "release_date.gte": addMonths(today, -1).toISOString(),
    "release_date.lte": today.toISOString(),
  });
  return response as ApiResponse;
});

export const useGenres = routeLoader$(async () => {
  const response = await fetchData(`/genre/movie/list`);
  return response as GenreResponse;
});

export default component$(() => {
  const nowPlayingMovies = useNowPlayingMovies();
  const genres = useGenres();

  return (
    <div class="flex flex-col">
      <MovieSection
        title="Now playing"
        movies={nowPlayingMovies.value.results}
        genres={genres.value.genres}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: appTitle,
  meta: [
    {
      name: "description",
      content: appDescription,
    },
  ],
};
