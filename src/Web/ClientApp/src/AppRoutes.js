import { FetchData } from "./components/pages/FetchData";
import { Home } from "./components/pages/Home";
import { Movies } from "./components/pages/Movies";
import  { SearchMovies } from "./components/pages/SearchMovies";

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
    path: "/fetch-data",
    element: <FetchData />,
  },
];

export default AppRoutes;
