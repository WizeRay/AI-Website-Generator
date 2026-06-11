import Navbar from "../components/Navbar";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="bg-black min-h-screen">
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default RootLayout
