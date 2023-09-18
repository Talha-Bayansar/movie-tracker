import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { type Providers, type MovieDetails } from "~/movies";
import { appTitle, fetchData, getMediaUrl } from "~/utils";
import { Image } from "@unpic/qwik";
import { Star } from "~/shared";

type ProvidersApiResponse = {
  id: number;
  results: {
    [key: string]: Providers;
  };
};

export const useMovie = routeLoader$(async (event) => {
  const id = event.params.id;
  const movie = await fetchData<MovieDetails>(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/movie/${id}`
  );
  return movie;
});

export const useProviders = routeLoader$(async (event) => {
  const id = event.params.id;
  const providerResponse = await fetchData<ProvidersApiResponse>(
    event.env.get("MOVIE_READ_TOKEN") as string,
    `/movie/${id}/watch/providers`
  );
  return providerResponse.results;
});

export default component$(() => {
  const movie = useMovie();
  // const providers = useProviders();

  return (
    <div
      class="flex flex-col gap-4 flex-grow p-6 bg-contain bg-no-repeat"
      style={`background-image:linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url(${getMediaUrl(
        "w500",
        movie.value.backdrop_path
      )})`}
    >
      <div class="flex gap-8 mt-36">
        <div class="flex-grow-[2]">
          <Image
            class="w-full rounded"
            width={160}
            height={240}
            src={getMediaUrl("w300", movie.value.poster_path)}
            alt={`Poster of the movie: ${movie.value.title}`}
          />
        </div>
        <div class="flex flex-col flex-grow-[3] gap-4">
          <h1 class="text-xl">{movie.value.title}</h1>
          <div class="flex flex-wrap text-sm gap-2 text-c-grey">
            <span class="flex items-center">
              <Star size={12} /> {movie.value.vote_average.toFixed(1)}
            </span>
            | <span>{movie.value.vote_count} reviews</span>|
            <span class="flex">{movie.value.runtime} min</span>|{" "}
            <span>{movie.value.genres.map((v) => v.name).join(", ")}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <h2 class="text-xl">Overview</h2>
        <p class="text-sm text-c-grey">{movie.value.overview}</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const movie = resolveValue(useMovie);
  // const providers = resolveValue(useProviders);
  const title = movie.title; // Replace with the actual movie title
  const overview = movie.overview; // Replace with the actual movie description
  const genre = movie.genres.map((v) => v.name).join(", "); // Replace with the actual movie genre
  const rating = movie.vote_average.toFixed(1); // Replace with the actual movie rating
  const releaseYear = movie.release_date; // Replace with the actual movie release year
  // const streamingPlatforms = [
  //   ...(providers.buy?.map((v) => v.provider_name) ?? []),
  //   ...(providers.flatrate?.map((v) => v.provider_name) ?? []),
  //   ...(providers.rent?.map((v) => v.provider_name) ?? []),
  // ]; // Replace with the actual streaming platforms array

  // const platformList = streamingPlatforms.join(", "); // Convert the array to a comma-separated string
  const platformList = ""; // Convert the array to a comma-separated string

  const movieDescription = `Explore ${title}, a ${genre} film released in ${releaseYear} with a rating of ${rating} available on ${platformList}. ${overview} Discover more about it now!`;

  return {
    title: `${appTitle} | ${title}`,
    meta: [
      {
        name: "description",
        content: movieDescription,
      },
    ],
  };
};
