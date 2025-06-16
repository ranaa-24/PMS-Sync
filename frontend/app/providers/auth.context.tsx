import { createContext, type ReactNode, useState, useContext, useEffect } from "react";
import { type User } from "@/types/index"
import { queryClient } from "./react-query-provider";
import { useNavigate, useLocation } from "react-router";
import { publicRoutes } from "@/lib/otherUtilities";

interface AuthContextType {
    user: User | null,
    // setUser: (user: User | null) => void,            ==> simplyfied setter type, wont allow setXX(pre => pre+1)
    // setUser: Dispatch<SetStateAction<User | null>>,
    isAuthenticated: boolean,
    isLoading: boolean,
    login: (data: any) => Promise<void>,              // will be async function
    logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }

    return context;
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const currentPath = useLocation().pathname;
    
    const isPublicRoute = publicRoutes.includes(currentPath);

    // if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const userInfo = localStorage.getItem("user");

            if (userInfo) {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                if (!isPublicRoute) {
                    navigate('/login');
                }
            }

            setIsLoading(false);
        }

        checkAuth();

    }, []);

    // force logout
    useEffect(() => {
        const handleLogOut = () => {
            logout();
            navigate('/login');

        }
        window.addEventListener("force-logout", handleLogOut);

        return () => window.removeEventListener("force-logout", handleLogOut);
    }, []);

    const login = async (data: any): Promise<void> => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        setUser(data?.user);
        setIsAuthenticated(true);
    }

    const logout = async (): Promise<void> => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();        // clears all the fetch / query caches
        navigate('/login');
    }


    const values = {
        user, setUser, isLoading, setIsAuthenticated, isAuthenticated, setIsLoading, login, logout
    }

    return <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
}

