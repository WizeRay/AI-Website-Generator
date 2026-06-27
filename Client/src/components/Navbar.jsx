import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import api from "../configs/axios.config"
import { useSession } from "../../lib/auth-client";
import ProfileAvatar from "./ProfileAvatar";
import axios from "axios";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!session) {
      setCredits(null);
      return;
    }

    const controller = new AbortController();

    const fetchCredits = async () => {
      setCreditsLoading(true);
      try {
        // TODO: replace with real endpoint, e.g. `/api/user/credits`
        const res = await api.get("/user/credits", {
          signal: controller.signal,
        });
        //axios sends json parsed data in .data
        setCredits(res.data.credits);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch credits:", err);
          setCredits(null);
        }
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCredits();

    return () => controller.abort();
  }, [session]);

  if (isPending) {
    return <p>Loading..</p>;
  }

  return (
    <div>
      <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-slate-800">
        <Link to="/" className="font-extrabold text-2xl">
          SiteBuilder
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/projects">My Projects</Link>
          <Link to="pricing">Pricing</Link>
        </div>

        {/* Right-side group: auth/profile + hamburger live together so
            justify-between only ever sees two top-level items (logo vs. rest).
            This is what keeps the avatar pinned to the right on small screens. */}
        <div className="flex items-center gap-4">
          {!session ? (
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="active:scale-95 hover:bg-indigo-700/20 transition px-4 py-2 border border-indigo-600 rounded-md"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signUp")}
                className="px-6 py-2 bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md"
              >
                Get started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center text-sm font-medium px-3 py-1 rounded-full border border-indigo-600 bg-indigo-600/10">
                  {creditsLoading ? "..." : credits !== null ? `${credits} credits` : "—"}   
              </button>
              <ProfileAvatar user={session.user} />
            </div>
          )}

          <button
            id="open-menu"
            className="md:hidden active:scale-90 transition"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          {session && <Link to="/projects" onClick={() => setMenuOpen(false)}>
            Projects
          </Link>}
          <Link to="/community" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link to="pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>

          {!session && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="active:scale-95 px-6 py-2 border border-indigo-600 rounded-md"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/signUp");
                }}
                className="active:scale-95 px-6 py-2 bg-indigo-600 rounded-md"
              >
                Get started
              </button>
            </div>
          )}

          <button
            className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
