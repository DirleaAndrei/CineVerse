import { Home } from "./components/pages/Home";
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
];

export default AppRoutes;
