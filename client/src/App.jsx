import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { LandingPage, HomeLayout } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <h1>404 Page Not Found</h1>,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
