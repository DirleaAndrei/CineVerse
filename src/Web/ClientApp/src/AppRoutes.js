import { FetchData } from "./components/pages/FetchData";
import { Home } from "./components/pages/Home";
import { Movies } from "./components/pages/Movies";

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
    path: "/fetch-data",
    element: <FetchData />,
  },
];

export default AppRoutes;
