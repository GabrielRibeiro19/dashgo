import { Stack } from "@chakra-ui/react";
import { NavSection } from "./NavSection";
import { NavLink } from "./NavLink";
import { RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine, RiShoppingCartLine } from "react-icons/ri";
import { BsFillBagCheckFill } from "react-icons/bs";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
        <NavLink icon={BsFillBagCheckFill} href="/orders">Pedidos</NavLink>
        <NavLink icon={RiContactsLine} href="/users">Usuários</NavLink>
        <NavLink icon={RiShoppingCartLine} href="/products">Produtos</NavLink>
      </NavSection>
      <NavSection title="AUTOMAÇÃO">
        <NavLink icon={RiInputMethodLine} href="/forms">Formulários</NavLink>
        <NavLink icon={RiGitMergeLine} href="/automation">Automação</NavLink>
      </NavSection>
    </Stack>
  )
}
