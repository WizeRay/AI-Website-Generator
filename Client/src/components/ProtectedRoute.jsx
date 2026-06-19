import { Navigate,Outlet } from "react-router";
import { useSession } from "../../lib/auth-client";


function ProtectedRoute() {

    const {data: session, isPending } = useSession();

    if (isPending) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
        );
    }

    if(!session){
        return <Navigate to="/login" replace />
    }

    return <Outlet />

  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute
