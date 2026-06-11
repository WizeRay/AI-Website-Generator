import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
function RootLayout() {
  return (
    <div className="bg-black min-h-screen">
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default RootLayout
