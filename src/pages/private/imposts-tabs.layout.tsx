import { Outlet, useLocation, useNavigate } from "react-router"
import { AppMenuTopbar, AppTopbarButton } from "@/components/app-menu-topbar"
import { YearPicker } from "@/components/calendar-year-picker"
import { useContext } from "react"
import { SystemContext } from "@/contexts/system.context"
import { Separator } from "@/components/ui/separator"

export default function ImpostosTabsLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const { 
    selectedYear,
    setSelectedYear
  } = useContext(SystemContext)

  const colorIconWhenSelected = "var(--lime-base)"

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      
      <AppMenuTopbar setIsExpanded={() => {}}>

        <YearPicker 
          className="!h-10"
          value={selectedYear} 
          onChange={setSelectedYear} 
        />

        <Separator orientation="vertical" className="!h-10 bg-my-background-secondary" />

        <AppTopbarButton
            className="text-my-foreground" 
            isExpanded
            text="Resultado fiscal"
            icon="calculate"
            isSelected={location.pathname === "/carteira/impostos"}
            colorIconWhenSelected={colorIconWhenSelected}
            onClick={() => navigate("/carteira/impostos")}
        />

        <AppTopbarButton
            className="text-my-foreground" 
            isExpanded
            text="Minhas DARFs"
            icon="cards_stack"
            isSelected={location.pathname === "/carteira/darfs"}
            colorIconWhenSelected={colorIconWhenSelected}
            onClick={() => navigate("/carteira/darfs")}
        />

        <AppTopbarButton
            className="text-my-foreground" 
            isExpanded
            text="Compensações"
            icon="balance"
            isSelected={location.pathname === "/carteira/compensacoes"}
            colorIconWhenSelected={colorIconWhenSelected}
            onClick={() => navigate("/carteira/compensacoes")}
        />
      </AppMenuTopbar>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
