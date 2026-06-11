import { useState } from "react";
import {Loader2Icon} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";

function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)

    //Simulate API call
    setTimeout(()=>{
        setLoading(false)
    },3000)

  }

  return (
      <div className="bg-black min-h-screen">
       
        <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
          
        <Link 
          to="/pricing"
           className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20">
          <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">NEW</span>
          <p className="flex items-center gap-2">
            <span>Try 30 days free trial option</span>
          </p>
        </Link> 

        <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
          Turn thoughts into websites instantly, with AI.
        </h1>

        <p className="text-center text-base max-w-md mt-2">
          Create, customize and present faster than ever with intelligent design powered by AI.
        </p>

        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
          <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2">
                {!loading? 'Create with AI':
                <>
                    Creating <Loader2Icon className="animate-spin size-4 text-white"/>
                </>}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
        </div>
      </section>
    </div>
    
  )
}

export default Home


