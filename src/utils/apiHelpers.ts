export const getMediaUrl = (size: string, path: string) =>
  `https://image.tmdb.org/t/p/${size}${path}`;

const fetchAuthenticated = async (url: string) => {
  console.log("PUBLIC_MOVIE_READ_TOKEN", process.env.PUBLIC_MOVIE_READ_TOKEN);
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_MOVIE_READ_TOKEN}`,
    },
  };
  const response = await fetch(url, options);
  const result = await response.json();
  return result;
};

export const fetchData = async <T>(path: string, parameters?: any) => {
  let url = `https://api.themoviedb.org/3${path}`;

  if (parameters) {
    const params = Object.entries(parameters).reduce(
      (prev, cur) => `${prev}&${cur[0]}=${cur[1]}`,
      ""
    );
    url = `${url}?${params}`;
  }

  const response = fetchAuthenticated(url);
  return response as T;
};

export const fetchImage = async <T>(path: string, size: string) => {
  const url = getMediaUrl(size, path);

  const response = fetchAuthenticated(url);
  return response as T;
};
