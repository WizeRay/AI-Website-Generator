import { useNavigate,useParams,Link } from "react-router";
import {Loader2Icon,MessageSquare, XIcon,SmartphoneIcon, TabletIcon, LaptopIcon, SaveIcon,FullscreenIcon, ArrowBigDownDash,EyeOffIcon,EyeIcon} from "lucide-react";
import { useState,useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ProjectPreview from "../components/ProjectPreview";
import { useSession } from "../../lib/auth-client";
import api from "../configs/axios.config";
function Projects() {
  const {projectId} = useParams();
  const navigate = useNavigate();

  const [project,setProject] = useState(null);
  const [loading,setLoading] = useState(true);

  const [isGenerating,setIsGenerating] = useState(true);//understand why
  const [device,setDevice] = useState("desktop")

  const[isMenuOpen,setIsMenuOpen] = useState(false);
  const [isSaving, setisSaving] = useState(false);
  const [error,setError] = useState(null);
  const previewRef = useRef(null);
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
const fetchProject = async () =>{
try{
  const {data} = await api.get(`/projects/${projectId}`);
  setProject(data.project);
  setIsGenerating(data.project.status === 'pending')
  setLoading(false)
} catch (err){
  console.error(err);
  setError(err.response?.data?.message || "Something went wrong. Please try again.");
  setLoading(false);
}

}

const togglePublish = async () => {
  try {
      await api.patch(`/projects/${projectId}/publish`);
      setProject((prev)=> prev ? ({...prev, isPublished : !prev.isPublished}) : null)
  } catch (err) {
    console.log(err);
    setError(err.response?.data?.message || "Something went wrong. Please try again.");
  }
}

// download code (index.html)
const downloadCode = async () => {
  const code = previewRef.current.getCode() || project?.current_code;
  if(!code) return;
  const element = document.createElement('a');
  const file = new Blob([code],{type:"text/html"});
  element.href = URL.createObjectURL(file);
  element.download = "index.html";
  document.body.appendChild(element);
  element.click();
}
const saveProject = async () => {
  if(!previewRef.current) return;
  const code = previewRef.current.getCode();
  if(!code) return;
  setisSaving(true);
  try{
    await api.put(`/save/${projectId}`,{code});

  }catch(err){
    console.log(err);
    setError(err.response?.data?.message || "Something went wrong. Please try again.");
  
  }finally{
    setisSaving(false);
  }
}

useEffect(()=>{
  if(session.user){
    fetchProject();
  }else if(!isPending && !session.user){
    navigate("/");
    return setError( "Please login to view your project")
  }
},[session.user])

useEffect(() => {
if(project && !project.status === 'pending'){
  const intervalid = setInterval(fetchProject,10000);
  return ()=> clearInterval(intervalid)
}

//calling first time the component renders after reloading
  
}, [project])

if(loading){
  return(
    <>
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className ="size-7 animate-spin text-violet-200"/>
      </div>
    </>
  )
}
return project ? (
  <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
    {/* builder navbar */}
    <div 
    className="flex items-center justify-between gap-4 px-4 py-2"
    >
      {/* left */}
      <div className="flex items-center gap-2 min-w-0">

        <img 
        src="/favicon.svg" 
        alt="logo" 
        className="h-6 cursor-pointer"
        onClick={()=> navigate('/')}
        />
        <div className="max-w-xs min-w-0">
          <p 
          className="text-sm font-medium capitalize truncate"
          >
            {project.name}
          </p>
          <p 
          className="text-xs text-gray-400 -mt-0.5">Previewing last saved version</p>
        </div>
        <div className="sm:hidden flex-1 flex justify-end">
          { isMenuOpen ? 
          <MessageSquare onClick={()=>{setIsMenuOpen(false)}} className="size-6 cursor-pointer"/>
          :<XIcon onClick={()=>{setIsMenuOpen(true)}} className="size-6 cursor-pointer"/>

          }
        </div>
        {error && (
              <p className="mt-3 text-center text-sm text-red-500">
                  {error}
              </p>
            )}
      </div>
      {/* middle  */}
      <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
          <SmartphoneIcon 
          onClick={()=> setDevice('phone')}
          className={`size-6 p-1 rounded cursor-pointer ${ device === 'phone'? "bg-gray-700" : "" } `}
          />
          <TabletIcon
          onClick={()=> setDevice('tablet')}
          className={`size-6 p-1 rounded cursor-pointer ${ device === 'tablet'? "bg-gray-700" : "" } `}
          />
          <LaptopIcon
          onClick={()=> setDevice('desktop')}
          className={`size-6 p-1 rounded cursor-pointer ${ device === 'desktop'? "bg-gray-700" : "" } `}
          />

      </div>
      {/* right */}
      <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
          <button 
          onClick={saveProject}
          disabled={isSaving}
          className="max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700">
            {isSaving ? <Loader2Icon className="animate-spin" size={16}/> : <SaveIcon size={16}/>}
             Save
          </button>

          <Link target="_blank" to={`/preview/${project.id}`}
          className="flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors">
            <FullscreenIcon size={16}/> Preview
          </Link>

          <button 
          onClick={downloadCode}
          className="bg-gradient-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm  transition-colors">
            <ArrowBigDownDash size={16}/> Download
          </button>

          <button
          onClick={togglePublish}
          className="bg-gradient-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors">
            {project.isPublished ?
            <EyeOffIcon size={16}/>: <EyeIcon size={16}/>}
            {project.isPublished ? "Unpublish" : "Publish"}
          </button>
      </div>
    </div>
    <div className="flex-1 flex overflow-auto">
              {project ? <Sidebar isMenuOpen ={isMenuOpen} project={project} setProject={(p)=>setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating}/>: <Loader2Icon className="animate-spin" size={16}/>}
              <div className="flex-1 p-2 pl-0">
                <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
              </div>
    </div>
  </div>
)
:
(
<div className="flex items-center justify-center h-screen">
  <p className="text-2xl font-medium text-gray-200">Unable to load project</p>
</div>
)
}

export default Projects
