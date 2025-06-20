import { createContext, useState, type ReactNode, type Dispatch,type SetStateAction, useContext } from "react";

type SidebarContextType = {
    isPannelClosed: boolean;
    setIsPannelClosed: Dispatch<SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
        if (!context) {
            throw new Error("useSidebarContext must be used within an SidebarContextProvider");
        }
    
        return context;
} 

export function SidebarContextProvider({ children }: { children: ReactNode }) {
    const [isPannelClosed, setIsPannelClosed] = useState(false);

    return (
        <SidebarContext.Provider value={{ isPannelClosed, setIsPannelClosed }}>
            {children}
        </SidebarContext.Provider>
    );
}
