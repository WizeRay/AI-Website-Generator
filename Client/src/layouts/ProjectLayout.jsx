import { Outlet } from "react-router";


function ProjectLayout() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Outlet/>
    </div>
  )
}

export default ProjectLayout
