import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, Link } from "@builder.io/qwik-city";
import type { Providers, MovieDetails, Provider } from "~/movies";
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
  const providers = useProviders();
  const provider =
    Object.keys(providers.value).length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        providers.value["US"] ??
        providers.value[Object.keys(providers.value)[0]]
      : undefined;
  const duplicateStreamingPlatforms = [
    ...(provider?.buy ?? []),
    ...(provider?.flatrate ?? []),
    ...(provider?.rent ?? []),
  ];
  const uniqueStreamingPlatforms = duplicateStreamingPlatforms.filter(
    (value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        duplicateStreamingPlatforms.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    }
  );

  return (
    <div class="flex flex-col gap-12 flex-grow p-6 relative">
      <Backdrop movie={movie.value} />
      <Main movie={movie.value} />
      <StreamingPlatforms
        providers={provider}
        streamingPlatforms={uniqueStreamingPlatforms}
      />
      <Overview overview={movie.value.overview} />
    </div>
  );
});

const Backdrop = component$(({ movie }: { movie: MovieDetails }) => {
  return (
    <div class="absolute top-0 left-0 right-0 z-0">
      <div class="absolute z-10 inset-0 bg-gradient-to-b from-transparent to-c-background" />
      <Image
        src={getMediaUrl("w500", movie.backdrop_path)}
        width={500}
        height={281}
        alt={`Backdrop of the movie: ${movie.title}`}
      />
    </div>
  );
});

const Main = component$(({ movie }: { movie: MovieDetails }) => {
  return (
    <div class="flex gap-8 mt-36 z-10">
      <div class="flex-grow-[2]">
        <Image
          class="w-full rounded"
          width={160}
          height={240}
          src={getMediaUrl("w300", movie.poster_path)}
          alt={`Poster of the movie: ${movie.title}`}
        />
      </div>
      <div class="flex flex-col flex-grow-[3] gap-4">
        <h1 class="text-xl">{movie.title}</h1>
        <div class="flex flex-wrap text-sm gap-2 text-c-grey">
          <span class="flex items-center gap-1">
            <Star size={12} /> {movie.vote_average.toFixed(1)}
          </span>
          | <span>{movie.vote_count} reviews</span>|
          <span class="flex">{movie.runtime} min</span>|{" "}
          <span>{movie.genres.map((v) => v.name).join(", ")}</span>
        </div>
      </div>
    </div>
  );
});

const StreamingPlatforms = component$(
  ({
    providers,
    streamingPlatforms,
  }: {
    providers?: Providers;
    streamingPlatforms: Provider[];
  }) => {
    return (
      <div class="flex flex-col gap-4">
        <h2 class="text-lg">Available on</h2>
        {providers ? (
          <Link href={providers.link} target="_blank">
            <div class="flex flex-wrap gap-4">
              {streamingPlatforms.map((v) => (
                <Image
                  class="w-8 rounded-lg"
                  key={v.provider_id}
                  src={getMediaUrl("w500", v.logo_path)}
                  width={500}
                  height={500}
                  alt={`Logo of ${v.provider_name}`}
                />
              ))}
            </div>
          </Link>
        ) : (
          <p>Not found.</p>
        )}
      </div>
    );
  }
);

const Overview = component$(({ overview }: { overview: string }) => {
  return (
    <div class="flex flex-col gap-4">
      <h2 class="text-xl">Overview</h2>
      <p class="text-sm text-c-grey">{overview}</p>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const movie = resolveValue(useMovie);
  const providers = resolveValue(useProviders);
  const title = movie.title; // Replace with the actual movie title
  const overview = movie.overview; // Replace with the actual movie description
  const genre = movie.genres.map((v) => v.name).join(", "); // Replace with the actual movie genre
  const rating = movie.vote_average.toFixed(1); // Replace with the actual movie rating
  const releaseYear = movie.release_date; // Replace with the actual movie release year
  const provider =
    Object.keys(providers).length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        providers["US"] ?? providers[Object.keys(providers)[0]]
      : undefined;
  const streamingPlatforms = [
    ...(provider?.buy?.map((v) => v.provider_name) ?? []),
    ...(provider?.flatrate?.map((v) => v.provider_name) ?? []),
    ...(provider?.rent?.map((v) => v.provider_name) ?? []),
  ]; // Replace with the actual streaming platforms array

  const platformList = [...new Set(streamingPlatforms)].join(", "); // Convert the array to a comma-separated string

  const movieDescription = `Explore ${title}, a ${genre} film released in ${releaseYear} with a rating of ${rating} ${
    streamingPlatforms.length > 0
      ? `available on ${platformList}`
      : "unavailable at the moment"
  }. ${overview} Discover more about it now!`;

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
