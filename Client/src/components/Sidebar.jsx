import { BotIcon, Loader2Icon, SendIcon, UserIcon,EyeIcon } from "lucide-react";
import { useRef,useEffect,useState } from "react";
import { Link } from "react-router";
import api from "../configs/axios.config";
function Sidebar({isMenuOpen,project,setProject,isGenerating,setIsGenerating}) {
    const messageRef = useRef(null);
    const [input, setInput] = useState("")
    const conversation = Array.isArray(project?.conversation) ? project.conversation : [];
    const versions = Array.isArray(project?.versions) ? project.versions : [];
    const [error,setError] = useState(null);

    const fetchProject = async () => {
        try {
            const { data } = await api.get(`/projects/${project.id}`);
            setProject(data.project);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again."); 
        }
    }
   
    useEffect(()=>{
        if(messageRef.current){
            messageRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[conversation.length, isGenerating])

    const handleRollback = async (versionId) => {
        try {
            const confirm = window.confirm('Are you sure you want to rollback to this version?')
            if(!confirm) return;
            setIsGenerating(true);
            const {data} = await api.post(`/rollback/${project.id}/${versionId}`);
            setProject(data.project);
            setIsGenerating(false);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
            setIsGenerating(false);
        }
    }
    const handleRevisions = async (e) => {
        e.preventDefault();
        
        try{
            setIsGenerating(true);
            const {data} = await api.post(`/revision/${project.id}`,{message: input})
            setProject(data.project);
            setInput('');
    
        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");

        } finally {
            setIsGenerating(false);
        }
    } 
  return (
    <div className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"}`}>
        <div className="flex flex-col h-full">
            {/* Message Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
                {[...conversation, ...versions].sort((a,b)=> new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message)=>{
                    const isMessage = 'content' in message; 
                    
                    if(isMessage){
                        const msg = message;
                        const isUser = msg.role ==="user";
                        return(
                            <div key ={msg.id} className = {`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                                {!isUser && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                                        <BotIcon className="size-5 text-white"/>
                                    </div>
                                )}
                                <div className ={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none" : " rounded-tl-none bg-gray-800 text-gray-100"}`}>
                                    {msg.content}
                                </div>
                                {isUser && (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                        <UserIcon className ="size-5 text-gray-200"/>
                                    </div>
                                )}

                            </div>

                        )
                    }
                    else{
                        const ver = message;
                        return(
                            <div key = {ver.id} className="w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2">
                                <div className="text-xs font-medium">
                                    code updated <br />
                                        <span className="text-gray-500 text-xs font-normal">
                                            {new Date(ver.timestamp).toLocaleString()}
                                        </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    {project.current_version_index === ver.id ? (
                                        <button className="px-3 py-1 rounded-md text-xs bg-gray-700">
                                            Current version</button>
                                    ):(
                                        <button onClick={()=>handleRollback(ver.id)} className="px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white">
                                            Roll back to this version</button>
                                    )}
                                    <Link target="_blank" to={`/preview/${project.id}/${ver.id}`}>
                                        <EyeIcon className = "size-6 p-1 bg-gray-700 hover:bg-indigo-500 transition-colors rounded"/>
                                    </Link>
                                </div>
                            </div>
                        )
                    }
                    })}
                    { isGenerating && (
                        <div className="flex items-start gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                                <BotIcon className="size-5 text-white"/>
                            </div>
                            {/* three dot loader */}
                            <div className="flex gap-1.5 h-full items-end">
                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{animationDelay:"0s"}}/>
                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{animationDelay:"0.2s"}}/>
                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{animationDelay:"0.4s"}}/>
                            </div>
                        </div>
                    )

                    }
                    <div ref={messageRef}/>
            </div>
            {/* Input Area */}
            <form className="m-3 relative">
                <div className="flex items-center gap-2">
                    <textarea 
                    onChange={(e)=>setInput(e.target.value)}
                    value={input}
                    rows={4} 
                    placeholder="Describe your website or request changes..."
                    className="flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all"
                    disabled={isGenerating}
                    />
                    <button
                    onClick={handleRevisions} 
                    disabled={isGenerating || !input.trim()}
                    className=" absolute bottom-2.5 right-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-80">
                        {isGenerating
                        ? <Loader2Icon className="size-7 p-1.5 animate-spin text-white"/>
                        : <SendIcon className="size-7 p-1.5 text-white"/> }
                    </button>
                </div>    
            </form>
        </div>
    </div>
  )
}

export default Sidebar
