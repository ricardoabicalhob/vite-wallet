import { useContext, useState } from "react"
import AppSidebar, { AppSidebarButton, AppSidebarGroupButtons, AppSidebarTrigger } from "../../components/app-sidebar"
import { TooltipProvider } from "../../components/ui/tooltip"
import AppTopbar from "../../components/app-topbar"
import { useLocation, useNavigate } from "react-router"

// import orquestraLogo from '../../assets/logos/Orquestra-logo.png'
import { AuthContext } from "@/contexts/auth.context"
import { removeAuthToken } from "@/repositories/localStorageAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { queryClient } from "@/services/queryClient"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { nameInInitialsFormat } from "@/utils/formatters"
import { SystemProvider } from "@/contexts/system.context"
import logoParcialIR from "../../assets/images/parte-logo-IR-fundo-transparente.png"

export default function LayoutConnected({ children }: { children? :React.ReactNode }) {

  const [ expandedSidebar, setExpandedSidebar ] = useState(true)
  
  const colorIconWhenSelected = "var(--lime-base)"
  const navigate = useNavigate()
  const location = useLocation()

  const { loginResponse } = useContext(AuthContext)
  
  const userName = loginResponse?.objetoResposta.name
  const userEmail = loginResponse?.objetoResposta.email
  const userRole = loginResponse?.objetoResposta.role

  const handleLogout = () => {
    queryClient.removeQueries()
    removeAuthToken()
    navigate('/')
  }

  const navigateToHome = () => navigate('/carteira');
  const navigateToMyPortfolio = () => navigate('/carteira/portifolio');
  const navigateToMyOrders = () => navigate('/carteira/ordens');
  const navigateToRebalanceamento = () => navigate('/carteira/rebalanceamento');
  const navigateToImpostos = () => navigate('/carteira/impostos');
  const navigateToDarfs = () => navigate('/carteira/darfs');
  // const navigateToMyDividends = () => navigate('/carteira/dividendos');

  return (
    <div className='flex flex-col w-full h-full bg-my-background overflow-y-auto custom-scrollbar'>
      <SystemProvider>
        <TooltipProvider>
          <nav>
            <AppTopbar>
              <div className="flex items-center gap-3 max-lg:mr-auto lg:gap-3">
                <AppSidebarTrigger 
                  className="text-gray-400 select-none" 
                  isExpanded={expandedSidebar} 
                  setIsExpanded={setExpandedSidebar} 
                />
                <div className="flex gap-2 items-center">
                    {/* <p className="z-50 text-my-foreground-secondary select-none max-[1100px]:hidden font-semibold" style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '4px', fontSize: 24}}>Invest<span className="text-lime-base/80">IR</span></p> */}
                    <div 
                        className="flex items-center z-50 text-my-foreground-secondary select-none max-[1100px]:hidden font-semibold" 
                        style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '4px', fontSize: 24}}
                    >
                        Invest
                        <img src={logoParcialIR} width={40} alt="logo-investir-topbar" />
                    </div>
                </div>
              </div>

              <div className="flex items-center gap-3 max-lg:ml-auto lg:gap-3">
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="select-none cursor-pointer w-12 h-12">
                      <AvatarFallback className="bg-lime-base text-2xl text-white">
                        { nameInInitialsFormat(userName ?? "ND") }
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[354px] bg-my-background-secondary px-0 py-0 border-none mt-6 mr-8 transition-opacity duration-300 shadow-xl shadow-my-background">
                    <div className="flex gap-2 py-3 px-6 items-center hover:bg-[#29292E]">
                      <Avatar className="select-none">
                        <AvatarFallback className="bg-lime-base text-white">
                          { nameInInitialsFormat(userName ?? "ND") }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-my-foreground-secondary text-sm font-bold">{ `${userName} ${userRole === "admin" ? `(Administrador)` : ''}` }</span>
                        <span className="text-my-foreground-secondary text-xs">{ userEmail }</span>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-[#29292E] my-0" />
                    <DropdownMenuItem className="!bg-my-background-secondary hover:!bg-[#29292E] rounded-none text-my-foreground-secondary hover:!text-my-foreground-secondary cursor-pointer py-3 px-6">Perfil</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#29292E] my-0" />
                    <div 
                      className="flex items-center py-3 px-6 hover:!bg-[#29292E] cursor-pointer"
                      onClick={()=> handleLogout()}  
                    >
                      <span className="material-symbols-outlined text-red-400 cursor-pointer select-none" style={{fontWeight: "bold"}}>logout</span>
                      <DropdownMenuItem className="!bg-inherit text-red-400 hover:!text-red-400 font-bold cursor-pointer select-none">Sair</DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </AppTopbar>
          </nav>
          <main className="flex h-[calc(100vh-80px)] bg-my-background">

            <aside>
              <AppSidebar isExpanded={expandedSidebar} setIsExpanded={setExpandedSidebar}>

                <AppSidebarButton 
                  className="text-my-foreground" 
                  isExpanded={expandedSidebar} 
                  isSelected={location.pathname === '/carteira'}
                  colorIconWhenSelected={colorIconWhenSelected}
                  text="Home" 
                  icon="home_app_logo" 
                  onClick={navigateToHome}
                />

                <AppSidebarGroupButtons title="investimentos" isExpanded={expandedSidebar}>
                  <AppSidebarButton 
                    className="text-my-foreground" 
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/portifolio'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Minha carteira" 
                    icon="wallet" 
                    onClick={navigateToMyPortfolio}
                  />

                  <AppSidebarButton 
                    className="text-my-foreground" 
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/ordens'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Minhas ordens" 
                    icon="home_storage" 
                    onClick={navigateToMyOrders}
                  />

                  {/* <AppSidebarButton 
                    className="text-my-foreground" 
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/dividendos'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Meus dividendos" 
                    icon="paid" 
                    onClick={navigateToMyDividends}
                  /> */}
                  
                </AppSidebarGroupButtons>

                <AppSidebarGroupButtons title="FERRAMENTAS" isExpanded={expandedSidebar}>
                  <AppSidebarButton
                    className="text-my-foreground"
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/rebalanceamento'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Rebalanceamento"
                    icon="tune"
                    onClick={navigateToRebalanceamento}
                  />

                  <AppSidebarButton 
                    className="text-my-foreground" 
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/impostos'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Imposto de renda" 
                    icon="pets" 
                    onClick={navigateToImpostos}
                  />

                  <AppSidebarButton 
                    className="text-my-foreground" 
                    isExpanded={expandedSidebar}
                    isSelected={location.pathname === '/carteira/darfs'}
                    colorIconWhenSelected={colorIconWhenSelected}
                    text="Minhas DARFs" 
                    icon="stacks"  //receipt
                    onClick={navigateToDarfs}
                  />
                </AppSidebarGroupButtons>
                
              </AppSidebar>
            </aside>

            <section className="flex flex-grow">
              {children}
            </section>
          </main>
        </TooltipProvider>
      </SystemProvider>
    </div>
  )
}