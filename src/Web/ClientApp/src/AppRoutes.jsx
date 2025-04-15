import { ServerError } from "./components/pages/ErrorPages/ServerError";
import { FetchData } from "./components/pages/FetchData";
import { Home } from "./components/pages/Home";
import { MovieDetails } from "./components/pages/MovieDetails";
import { Movies } from "./components/pages/Movies";
import { SearchMovies } from "./components/pages/SearchMovies";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/movies",
    element: <Movies />,
  },
  {
    path: "/movies/search",
    element: <SearchMovies />,
  },
  {
    path: "/movie-details/:id",
    element: <MovieDetails />,
  },
  {
    path: "/fetch-data",
    element: <FetchData />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
  },
];

export default AppRoutes;
