import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { type Movie, MovieSection } from "~/movies";
import { appDescription, appTitle, fetchData } from "~/utils";
import { addDays, addMonths, format, startOfToday } from "date-fns";
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
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/discover/movie`,
    {
      page: pageNumber ?? 1,
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      with_release_type: "2|3",
      "primary_release_date.gte": format(addMonths(today, -1), "yyyy-MM-dd"),
      "primary_release_date.lte": format(today, "yyyy-MM-dd"),
    }
  );
  return response as ApiResponse;
});

export const usePopularMovies = routeLoader$(async (event) => {
  const pageNumber = event.query.get("page");
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/movie/popular`,
    {
      page: pageNumber ?? 1,
    }
  );
  return response as ApiResponse;
});

export const useTopRatedMovies = routeLoader$(async (event) => {
  const pageNumber = event.query.get("page");
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/movie/top_rated`,
    {
      page: pageNumber ?? 1,
    }
  );
  return response as ApiResponse;
});

export const useUpcomingMovies = routeLoader$(async (event) => {
  const pageNumber = event.query.get("page");
  const today = startOfToday();
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/discover/movie`,
    {
      page: pageNumber ?? 1,
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      with_release_type: "2|3",
      "primary_release_date.gte": format(addDays(today, 1), "yyyy-MM-dd"),
    }
  );
  return response as ApiResponse;
});

export const useGenres = routeLoader$(async (event) => {
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/genre/movie/list`
  );
  return response as GenreResponse;
});

export default component$(() => {
  const nowPlayingMovies = useNowPlayingMovies();
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const upcomingMovies = useUpcomingMovies();
  const genres = useGenres();

  return (
    <div class="flex flex-col gap-8">
      <MovieSection
        title="Now playing"
        movies={nowPlayingMovies.value.results}
        genres={genres.value.genres}
      />
      <MovieSection
        title="Popular"
        movies={popularMovies.value.results}
        genres={genres.value.genres}
      />
      <MovieSection
        title="Top rated"
        movies={topRatedMovies.value.results}
        genres={genres.value.genres}
      />
      <MovieSection
        title="Upcoming"
        movies={upcomingMovies.value.results}
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
