import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom"
import Footer from './components/Footer/Footer'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Add from './pages/add/Add'
import Gig from './pages/gig/Gig'
import Gigs from './pages/gigs/Gigs'

import Messages from './pages/messages/Messages'
import Orders from './pages/orders/Orders'
import Message from './pages/message/Message'
import './App.scss'
import MyGigs from './pages/myGigs/MyGigs'

///////////////////////////////////////////
function App() {
  const Layout = () => {
    return (
      <div className='app'>
        <Navbar/>
        <Outlet/>
        <Footer/>
      </div>
    )
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <Home/>,
        },
        {
          path: "/login",
          element: <Login/>,
        },
        {
          path: "/register",
          element: <Register/>,
        },
        {
          path: "/add",
          element: <Add/>,
        },
        {
          path: "/gig",
          element: <Gig/>,
        },
        {
          path: "/gigs",
          element: <Gigs/>,
        },
        {
          path: "/MyGigs",
          element: <MyGigs/>,
        },
        {
          path: "/messages",
          element: <Messages/>,
        },
        {
          path: "/orders",
          element: <Orders/>,
        },
        {
          path: "/message",
          element: <Message/>,
        },

      ],
    },
  ]);
  return (
    <div>
     <RouterProvider router={router} />
    </div>
  )
}

export default App
