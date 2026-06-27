import { Outlet } from "react-router";

import { useOutletContext } from "react-router";
function ProjectLayout() {
  const context = useOutletContext();
  return (
    <div className="bg-gray-900 min-h-screen">
      
      <Outlet context = {context}/>
    </div>
  )
}

export default ProjectLayout
