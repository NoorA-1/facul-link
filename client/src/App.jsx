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
  AdminDashboardLayout,
  AdminHomePage,
  SearchJob,
  AllJobs,
  AppHistory,
  Bookmarks,
  AdminManageJobsPage,
  AdminManageTeachersPage,
  AdminManageEmployersPage,
  AdminManageHiringTestsPage,
} from "./pages";

import { loader as profileSetupLoader } from "./pages/ProfileSetup";
import { loader as manageAccountLoader } from "./pages/ManageAccountPage";
import { loader as dashboardLoader } from "./pages/teacher/DashboardLayout";
import { loader as AdminDashboardLoader } from "./pages/admin/AdminDashboardLayout";
// const token = Cookies.get("token");
// if (token) {
//   console.log(token);
//   const decodedToken = jwtDecode(token);
//   console.log(decodedToken);
// }

const App = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [token, setToken] = useState({
    token: null,
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cookies.token) {
      const decodedToken = jwtDecode(cookies.token);
      setToken(() => {
        return {
          token: cookies.token,
          role: decodedToken.role,
        };
      });
    } else {
      setToken(null);
    }
    setIsLoading(false);
  }, [cookies, setCookie]);
  useEffect(() => {
    if (token) {
      console.log(token);
    }
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
          element: !token ? (
            <SignUpPage />
          ) : token.role !== "admin" ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Navigate to="/admin-dashboard" />
          ),
        },
        {
          path: "sign-in",
          element: !token ? (
            <SignInPage />
          ) : token.role !== "admin" ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Navigate to="/admin-dashboard" />
          ),
        },
        {
          path: "sign-up-teacher",
          element: !token ? (
            <TeacherSignUpPage />
          ) : token.role !== "admin" ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Navigate to="/admin-dashboard" />
          ),
        },
        {
          path: "sign-up-employer",
          element: !token ? (
            <EmployerSignUpPage />
          ) : token.role !== "admin" ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Navigate to="/admin-dashboard" />
          ),
        },
        {
          path: "profile-setup",
          element:
            token && token.role !== "admin" ? (
              <ProfileSetup />
            ) : (
              <Navigate to="/" />
            ),
          // element: <ProfileSetup />,
          loader: profileSetupLoader,
        },
        {
          path: "manage-account",
          element:
            token && token.role !== "admin" ? (
              <ManageAccountPage />
            ) : (
              <Navigate to="/" />
            ),
          loader: manageAccountLoader,
        },
        {
          path: "dashboard",
          element:
            token && token.role !== "admin" ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/" />
            ),
          loader: dashboardLoader,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "search-job",
              element: <SearchJob />,
            },
            {
              path: "all-jobs",
              element: <AllJobs />,
            },
            {
              path: "application-history",
              element: <AppHistory />,
            },
            {
              path: "bookmarks",
              element: <Bookmarks />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "manage-account",
              element: (
                <ManageAccountPage
                  headerDisabled={true}
                  footerDisabled={true}
                  backBtnDisabled={true}
                />
              ),
              loader: manageAccountLoader,
            },
          ],
        },
        {
          path: "admin-dashboard",
          element:
            token && token.role === "admin" ? (
              <AdminDashboardLayout />
            ) : (
              <Navigate to="/" />
            ),
          loader: AdminDashboardLoader,
          children: [
            {
              index: true,
              element: <AdminHomePage />,
            },
            {
              path: "manage-jobs",
              element: <AdminManageJobsPage />,
            },
            {
              path: "manage-teachers",
              element: <AdminManageTeachersPage />,
            },
            {
              path: "manage-employers",
              element: <AdminManageEmployersPage />,
            },
            {
              path: "manage-tests",
              element: <AdminManageHiringTestsPage />,
            },
            {
              path: "manage-account",
              element: (
                <ManageAccountPage
                  headerDisabled={true}
                  footerDisabled={true}
                  backBtnDisabled={true}
                />
              ),
              loader: manageAccountLoader,
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
