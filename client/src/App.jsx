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
  EmployerHomePage,
  AdminDashboardLayout,
  AdminHomePage,
  SearchJob,
  AllJobs,
  AppHistory,
  Bookmarks,
  HiringTests,
  PostJob,
  PostJobHome,
  AddHiringTest,
  AdminManageJobsPage,
  AdminManageTeachersPage,
  AdminManageEmployersPage,
  AdminManageHiringTestsPage,
  EmployerProfilePage,
  ViewEmployerProfilePage,
  JobPage,
  GiveHiringTest,
  SuccessPage,
  JobApplications,
  JobApplicationCandidates,
  ViewTeacherProfile,
  Notifications,
} from "./pages";

import { loader as profileSetupLoader } from "./pages/ProfileSetup";
import { loader as manageAccountLoader } from "./pages/ManageAccountPage";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as bookmarksLoader } from "./pages/teacher/Bookmarks";
import { loader as hiringTestsLoader } from "./pages/employer/HiringTests";
import { loader as postJobsLoader } from "./pages/employer/PostJobHome";
import { loader as postJobTestsLoader } from "./pages/employer/PostJob";
import { loader as applicationsHistoryLoader } from "./pages/teacher/AppHistory";
import { loader as JobApplicationsLoader } from "./pages/employer/JobApplications";
import { loader as searchJobLoader } from "./pages/SearchJob";
import { loader as AdminDashboardLoader } from "./pages/admin/AdminDashboardLayout";
import { loader as AdminEmployersLoader } from "./pages/admin/AdminManageEmployersPage";
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
              element:
                token?.role === "teacher" ? <HomePage /> : <EmployerHomePage />,
            },
            {
              path: "search-job",
              element: <SearchJob />,
              loader: searchJobLoader,
            },
            {
              path: "all-jobs",
              element: <AllJobs />,
            },
            {
              path: "application-history",
              element:
                token?.role === "teacher" ? (
                  <AppHistory />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: applicationsHistoryLoader,
            },
            {
              path: "application-history/:jobId",
              element:
                token?.role === "teacher" ? (
                  <AppHistory />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: applicationsHistoryLoader,
            },
            {
              path: "bookmarks",
              element:
                token?.role === "teacher" ? (
                  <Bookmarks />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: bookmarksLoader,
            },
            {
              path: "notifications",
              element: <Notifications />,
            },
            {
              path: "post-job",
              element:
                token?.role === "employer" ? (
                  <PostJobHome />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: postJobsLoader,
            },
            {
              path: "post-job/add",
              element:
                token?.role === "employer" ? (
                  <PostJob />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: postJobTestsLoader,
            },
            {
              path: "post-job/edit/:id",
              element:
                token?.role === "employer" ? (
                  <PostJob />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: postJobTestsLoader,
            },
            {
              path: "jobs/:id",
              element: <JobPage />,
            },
            {
              path: "job-application/hiring-test/:jobId",
              element:
                token?.role === "teacher" ? (
                  <GiveHiringTest />
                ) : (
                  <Navigate to="/dashboard" />
                ),
            },
            {
              path: "hiring-tests",
              element:
                token?.role === "employer" ? (
                  <HiringTests />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: hiringTestsLoader,
            },
            {
              path: "hiring-tests/add",
              element:
                token?.role === "employer" ? (
                  <AddHiringTest />
                ) : (
                  <Navigate to="/dashboard" />
                ),
            },
            {
              path: "hiring-tests/edit/:id",
              element:
                token?.role === "employer" ? (
                  <AddHiringTest />
                ) : (
                  <Navigate to="/dashboard" />
                ),
            },
            {
              path: "job-applications",
              element:
                token?.role === "employer" ? (
                  <JobApplications />
                ) : (
                  <Navigate to="/dashboard" />
                ),
              loader: JobApplicationsLoader,
            },
            {
              path: "job-application/candidate/:id",
              element:
                token?.role === "employer" ? (
                  <JobApplicationCandidates />
                ) : (
                  <Navigate to="/dashboard" />
                ),
            },
            {
              path: "profile",
              element:
                token?.role === "teacher" ? (
                  <ProfilePage />
                ) : (
                  token?.role === "employer" && <EmployerProfilePage />
                ),
            },
            {
              path: "teacher-profile/:id",
              element: <ViewTeacherProfile />,
            },
            {
              path: "employer-profile/:id",
              element: <ViewEmployerProfilePage />,
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
            {
              path: "success/:id",
              element: <SuccessPage />,
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
              loader: AdminEmployersLoader,
            },
            {
              path: "employer-profile/:id",
              element: <ViewEmployerProfilePage />,
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
