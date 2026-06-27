import { useState,useEffect } from "react"
import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import { useSession } from "../../lib/auth-client";
import api from "../configs/axios.config";

function Preview() {
  const [code, setCode] = useState("");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const {projectId, versionId} = useParams();
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
    try {
      const {data} = await api.get(`/preview/${projectId}`);
      let codeToShow = data.project.current_code;
      if(versionId){
        const matchedVersion = data.project.versions.find(
          (version) => version.id === versionId
        )
        if(matchedVersion){
          codeToShow = matchedVersion.code;
        }
      }
      setCode(codeToShow);
      setLoading(false);
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false)
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
    <div className ="h-screen">
      {error && (
              <p className="mt-3 text-center text-sm text-red-500">
                  {error}
              </p>
            )}
      {code && <ProjectPreview project={{current_code: code}}
      isGenerating={false} showEditorPanel={false}/>}
    </div>
  )
}


export default Preview
