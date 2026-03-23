import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";


const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchUser } = useAuthStore();
    const [ starting, setStarting ] = useState(true);
    const [ isReady, setIsReady ] = useState(false);
    
    useEffect(() => {
        const init = async () => {
            if (!accessToken) {
                await refresh();
            }
            setIsReady(true);
        }
        
        init();
    }, [accessToken, refresh]); 

    useEffect(() => {
        const loadUser = async () => {
            if (isReady && accessToken && !user) {
                await fetchUser();
            }
            setStarting(false);
        };
        
        if (isReady) {
            loadUser();
        }
    }, [isReady, accessToken, user, fetchUser]);

    if (starting || loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>; 
    }


    return <Outlet />;
}

export default ProtectedRoute;
