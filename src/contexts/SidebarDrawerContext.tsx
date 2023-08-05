import { UseDisclosureReturn, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, createContext, useContext, useEffect } from "react";

interface SidebarDrawerProps {
  children: ReactNode
}

type SidebarDrawerContextData = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({children}: SidebarDrawerProps) {

  const disclosure = useDisclosure()
  const router = useRouter()

  useEffect(() => {
    disclosure.onClose()
  }, [router.asPath, disclosure])

  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext)
