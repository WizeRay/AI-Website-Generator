import { Outlet } from "react-router";
import { Toaster } from "sonner";

function ProjectLayout() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster/>
      <Outlet/>
    </div>
  )
}

export default ProjectLayout
