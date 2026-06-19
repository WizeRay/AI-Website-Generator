import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Community from "../pages/Community";
import Projects from "../pages/Projects";
import MyProjects from "../pages/MyProjects";
import View from "../pages/View";
import Preview from "../pages/Preview";
import RootLayout from "../layouts/RootLayout";
import ProjectLayout from "../layouts/ProjectLayout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileDashboard from "../pages/ProfileDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "pricing",
        Component: Pricing,
      },
      {
        path: "community",
        Component: Community,
      },
    ],
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: RootLayout,
        children: [
          {
            path: "projects",
            Component: MyProjects,
          },
          {
            path:"dashboard",
            Component: ProfileDashboard
          }
        ],
      },
      {
        Component: ProjectLayout,
        children: [
          {
            path: "projects/:projectId",
            Component: Projects,
          },

          {
            path: "preview/:projectId",
            Component: Preview,
          },
          {
            path: "preview/:projectId/:versionId",
            Component: Preview,
          },

          {
            path: "view/:projectId",
            Component: View,
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
]);
