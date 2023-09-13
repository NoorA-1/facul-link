import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  LandingPage,
  HomeLayout,
  SignUpPage,
  TeacherSignUpPage,
  SignInPage,
  ErrorPage,
  EmployerSignUpPage,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
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
      {
        path: "/sign-up-teacher",
        element: <TeacherSignUpPage />,
      },
      {
        path: "/sign-up-employer",
        element: <EmployerSignUpPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
