import React from "react";
import Navbar from "./components/Navbar/Navbar";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CompleteProfile from "./pages/completeProfile/CompleteProfile";
import PasswordReset from "./pages/passwordReset/PasswordReset";
import Add from "./pages/add/Add";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import About from "./pages/about/About";
import AddContainer from "./pages/addContainer/AddContainer";
import Container from "./pages/container/Container";
import Containers from "./pages/containers/Containers";
import MyContainers from "./pages/myContainers/MyContainers";

import Messages from "./pages/messages/Messages";
import Orders from "./pages/orders/Orders";
import Message from "./pages/message/Message";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import BecomeSeller from "./pages/becomeSeller/BecomeSeller";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/terms/Terms";
import "./App.scss";
import MyGigs from "./pages/myGigs/MyGigs";
import {
  QueryClient,
  QueryClientProvider,
  // useQuery,
} from "@tanstack/react-query";
import { ModeProvider } from "./context/ModeContext";
import { AuthProvider } from "./context/AuthContext";
///////////////////////////////////////////
function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ModeProvider>
              <Navbar />
              <Outlet />
            </ModeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/add",
          element: (
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/MyGigs",
          element: (
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/add-container",
          element: (
            <ProtectedRoute>
              <AddContainer />
            </ProtectedRoute>
          ),
        },
        {
          path: "/container/:id",
          element: <Container />,
        },
        {
          path: "/containers",
          element: <Containers />,
        },
        {
          path: "/myContainers",
          element: (
            <ProtectedRoute>
              <MyContainers />
            </ProtectedRoute>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/message/:id",
          element: (
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/become-seller",
          element: (
            <ProtectedRoute>
              <BecomeSeller />
            </ProtectedRoute>
          ),
        },
        {
          path: "/privacy-policy",
          element: <Privacy />,
        },
        {
          path: "/terms-of-service",
          element: <Terms />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthLayout queryClient={queryClient}>
              <Login />
            </AuthLayout>
          </AuthProvider>
        </QueryClientProvider>
      ),
    },
    {
      path: "/register",
      element: (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthLayout queryClient={queryClient}>
              <Register />
            </AuthLayout>
          </AuthProvider>
        </QueryClientProvider>
      ),
    },
    {
      path: "/password-reset",
      element: (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthLayout queryClient={queryClient}>
              <PasswordReset />
            </AuthLayout>
          </AuthProvider>
        </QueryClientProvider>
      ),
    },
    {
      path: "/complete-profile",
      element: (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthLayout queryClient={queryClient}>
              <CompleteProfile />
            </AuthLayout>
          </AuthProvider>
        </QueryClientProvider>
      ),
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
