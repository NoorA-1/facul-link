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
  ManageAccountPage,
  ProfilePage,
  DashboardLayout,
  HomePage,
} from "./pages";

import { loader as profileSetupLoader } from "./pages/ProfileSetup";
import { loader as manageAccountLoader } from "./pages/ManageAccountPage";

// const token = Cookies.get("token");
// if (token) {
//   console.log(token);
//   const decodedToken = jwtDecode(token);
//   console.log(decodedToken);
// }

const App = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cookies.token) {
      setToken(cookies.token);
    } else {
      setToken(null);
    }
    setIsLoading(false);
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
          path: "sign-up",
          element: !token ? <SignUpPage /> : <Navigate to="/profile-setup" />,
        },
        {
          path: "sign-in",
          element: !token ? <SignInPage /> : <Navigate to="/profile-setup" />,
        },
        {
          path: "sign-up-teacher",
          element: !token ? (
            <TeacherSignUpPage />
          ) : (
            <Navigate to="/profile-setup" />
          ),
        },
        {
          path: "sign-up-employer",
          element: !token ? (
            <EmployerSignUpPage />
          ) : (
            <Navigate to="/profile-setup" />
          ),
        },
        {
          path: "profile-setup",
          element: token ? <ProfileSetup /> : <Navigate to="/" />,
          // element: <ProfileSetup />,
          loader: profileSetupLoader,
        },
        {
          path: "manage-account",
          element: token ? <ManageAccountPage /> : <Navigate to="/" />,
          loader: manageAccountLoader,
        },
        {
          path: "dashboard",
          element: token ? <DashboardLayout /> : <Navigate to="/" />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
          ],
        },
      ],
    },
  ]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <RouterProvider router={router} />;
};

export default App;
