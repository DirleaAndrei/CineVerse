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
];

export default AppRoutes;
