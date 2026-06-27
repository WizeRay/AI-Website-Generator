import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import api from "../configs/axios.config";


function View() {
  const {projectId} = useParams();
  const[code,setCode] = useState('');
  const [loading, setLoading] =  useState(true);
  
    
  const fetchCode = async () => {
   try {
    const {data} = await api.get(`/published/${projectId}`)
    setCode(data.project.current_code);
    
   } catch (err) {
    console.log(err)
    setError(err.response?.data?.message || "Something went wrong. Please try again.");

   } finally{
    setLoading(false);
   }
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
