import { $, component$, useStore } from "@builder.io/qwik";
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

const fetchNowPlayingMovies = async (token?: string, page?: number) => {
  const today = startOfToday();
  const response = await fetchData(
    token ?? (process.env.MOVIE_READ_TOKEN as string),
    `/discover/movie`,
    {
      page: page ?? 1,
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      with_release_type: "2|3",
      "primary_release_date.gte": format(addMonths(today, -1), "yyyy-MM-dd"),
      "primary_release_date.lte": format(today, "yyyy-MM-dd"),
    }
  );
  return response as ApiResponse;
};

const fetchPopularMovies = async (token?: string, page?: number) => {
  const response = await fetchData(
    token ?? (process.env.MOVIE_READ_TOKEN as string),
    `/movie/popular`,
    {
      page: page ?? 1,
    }
  );
  return response as ApiResponse;
};

const fetchTopRatedMovies = async (token?: string, page?: number) => {
  const response = await fetchData(
    token ?? (process.env.MOVIE_READ_TOKEN as string),
    `/movie/top_rated`,
    {
      page: page ?? 1,
    }
  );
  return response as ApiResponse;
};

const fetchUpcomingMovies = async (token?: string, page?: number) => {
  const today = startOfToday();
  const response = await fetchData(
    token ?? (process.env.MOVIE_READ_TOKEN as string),
    `/discover/movie`,
    {
      page: page ?? 1,
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      with_release_type: "2|3",
      "primary_release_date.gte": format(addDays(today, 1), "yyyy-MM-dd"),
    }
  );
  return response as ApiResponse;
};

export const useNowPlayingMovies = routeLoader$(async (event) => {
  const response = await fetchNowPlayingMovies(
    event.env.get("MOVIE_READ_TOKEN")
  );
  return response as ApiResponse;
});

export const usePopularMovies = routeLoader$(async (event) => {
  const response = await fetchPopularMovies(event.env.get("MOVIE_READ_TOKEN"));
  return response as ApiResponse;
});

export const useTopRatedMovies = routeLoader$(async (event) => {
  const response = await fetchTopRatedMovies(event.env.get("MOVIE_READ_TOKEN"));
  return response as ApiResponse;
});

export const useUpcomingMovies = routeLoader$(async (event) => {
  const response = await fetchUpcomingMovies(event.env.get("MOVIE_READ_TOKEN"));
  return response as ApiResponse;
});

export const useGenres = routeLoader$(async (event) => {
  const response = await fetchData(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/genre/movie/list`
  );
  return response as GenreResponse;
});

export const useToken = routeLoader$((event) => {
  return event.env.get("MOVIE_READ_TOKEN");
});

export default component$(() => {
  const { value: nowPlayingMovies } = useNowPlayingMovies();
  const { value: popularMovies } = usePopularMovies();
  const { value: topRatedMovies } = useTopRatedMovies();
  const { value: upcomingMovies } = useUpcomingMovies();
  const { value: token } = useToken();
  const genres = useGenres();

  const data = useStore({
    nowPlayingMovies,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
  });

  const handleEnd = $(
    async (
      currentValue: ApiResponse,
      loadFn: (token?: string, page?: number) => Promise<ApiResponse>
    ) => {
      if (currentValue.total_pages !== currentValue.page) {
        const response = await loadFn(token, currentValue.page + 1);
        return {
          ...response,
          results: [...currentValue.results, ...response.results],
        } as ApiResponse;
      }
    }
  );

  return (
    <div class="flex flex-col gap-8">
      <MovieSection
        title="Now playing"
        movies={data.nowPlayingMovies.results}
        genres={genres.value.genres}
        onEnd$={async () => {
          const response = await handleEnd(
            data.nowPlayingMovies,
            fetchNowPlayingMovies
          );
          if (response) {
            data.nowPlayingMovies = response;
          }
        }}
      />
      <MovieSection
        title="Popular"
        movies={data.popularMovies.results}
        genres={genres.value.genres}
        onEnd$={async () => {
          const response = await handleEnd(
            data.popularMovies,
            fetchPopularMovies
          );
          if (response) {
            data.popularMovies = response;
          }
        }}
      />
      <MovieSection
        title="Top rated"
        movies={data.topRatedMovies.results}
        genres={genres.value.genres}
        onEnd$={async () => {
          const response = await handleEnd(
            data.topRatedMovies,
            fetchTopRatedMovies
          );
          if (response) {
            data.topRatedMovies = response;
          }
        }}
      />
      <MovieSection
        title="Upcoming"
        movies={data.upcomingMovies.results}
        genres={genres.value.genres}
        onEnd$={async () => {
          const response = await handleEnd(
            data.upcomingMovies,
            fetchUpcomingMovies
          );
          if (response) {
            data.upcomingMovies = response;
          }
        }}
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
