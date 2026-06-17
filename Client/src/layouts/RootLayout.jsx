import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

function RootLayout() {
  return (
    <div className="bg-black min-h-screen">
        <Toaster/>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default RootLayout
