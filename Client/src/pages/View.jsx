import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { dummyProjects } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import { useSession } from "../../lib/auth-client";


function View() {
  const[projectId] = usePrams();
  const[sode,setCode] = useState('');
  const [loading, setLoading] =  useState(true);
  const { data: session, isPending } = useSession();
  
    if (isPending) {
      return (
        <div className="flex justify-center mt-20">
          Loading...
        </div>
      );
    }
  
    if (!session) {
      navigate("/login");
      return null;
    }
  const fetchCode = async () => {
    const code = dummyProjects.find(project=> project.id === projectId)?.current_code;
    setTimeout(()=>{
      if(code){
        setCode(code);
        setLoading(false);
      }
    },2000)
  }
  useEffect(()=>{
    fetchCode()
  },[]);
  if(loading){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200"/>
      </div>
    )
  }
  return (
    <div className="h-screen">
      {code && <ProjectPreview project={{current_code: code}}
      isGenerating={false} showEditorPanel={false}/>}
    </div>
  )
}

export default View
