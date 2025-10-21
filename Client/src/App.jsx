import React from "react";
import Navbar from "./components/Navbar/Navbar";
import AuthLayout from "./components/AuthLayout";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import About from "./pages/about/About";

import Messages from "./pages/messages/Messages";
import Orders from "./pages/orders/Orders";
import Message from "./pages/message/Message";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import BecomeSeller from "./pages/becomeSeller/BecomeSeller";
import "./App.scss";
import MyGigs from "./pages/myGigs/MyGigs";
import {
  QueryClient,
  QueryClientProvider,
  // useQuery,
} from "@tanstack/react-query";
import { ModeProvider } from "./context/ModeContext";
///////////////////////////////////////////
function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ModeProvider>
            <Navbar />
            <Outlet />
          </ModeProvider>
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
          element: <Add />,
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
          element: <MyGigs />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/become-seller",
          element: <BecomeSeller />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <AuthLayout queryClient={queryClient}>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthLayout queryClient={queryClient}>
          <Register />
        </AuthLayout>
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
