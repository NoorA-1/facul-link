import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { LandingPage, HomeLayout, SignUpPage, SignInPage } from "./pages";

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
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
