import React, { useEffect, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";

import {
  LandingPage,
  HomeLayout,
  SignUpPage,
  TeacherSignUpPage,
  SignInPage,
  ErrorPage,
  EmployerSignUpPage,
  ProfileSetup,
} from "./pages";

// const token = Cookies.get("token");
// if (token) {
//   console.log(token);
//   const decodedToken = jwtDecode(token);
//   console.log(decodedToken);
// }

const App = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (cookies.token) {
      setToken(cookies.token);
    }
  }, [cookies, setCookie]);
  useEffect(() => {
    if (token) console.log(token);
  }, [token]);
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
          element: !token ? <SignUpPage /> : <Navigate to="/profile-setup" />,
        },
        {
          path: "/sign-in",
          element: !token ? <SignInPage /> : <Navigate to="/profile-setup" />,
        },
        {
          path: "/sign-up-teacher",
          element: !token ? (
            <TeacherSignUpPage />
          ) : (
            <Navigate to="/profile-setup" />
          ),
        },
        {
          path: "/sign-up-employer",
          element: !token ? (
            <EmployerSignUpPage />
          ) : (
            <Navigate to="/profile-setup" />
          ),
        },
        {
          path: "/profile-setup",
          element: token ? <ProfileSetup /> : <Navigate to="/" />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
