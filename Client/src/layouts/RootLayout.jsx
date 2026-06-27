import Navbar from "../components/Navbar";
import { Outlet, useOutletContext } from "react-router";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

function RootLayout() {
  const context = useOutletContext;
  return (
    <div className="bg-black min-h-screen">
        <Toaster/>
        <Navbar/>
        <Outlet context = {context}/>
        <Footer/>
    </div>
  )
}

export default RootLayout
