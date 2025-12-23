import { YearPicker } from "@/components/calendar-year-picker";
import { DialogCreateOrder } from "@/components/dialog-create-order";
import { Display, DisplayBody, DisplayContent, DisplayHeader, DisplayItem, DisplayTitle } from "@/components/display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MoedaEmReal } from "@/components/moeda-percentual";
import { TableOrders } from "@/components/table-order";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth.context";
import { useOrdersByYear } from "@/queries/order";
import { usePortifolio } from "@/queries/portifolio";
import { filtarListaDeOrdens } from "@/utils/filters.utils";
import { Search } from "lucide-react";
import { useContext, useState } from "react";

export default function MyOrders() {

    const { loginResponse } = useContext(AuthContext)
    const userId = loginResponse?.objetoResposta.id || ""

    const [ inputFilter, setInputFilter ] = useState<string>("")
    const [ year, setYear ] = useState<number>(0)

    const { data: ordens, isLoading: isLoadingOrdens, isError: isErrorOrdens } = useOrdersByYear(userId, year)
    const { data: portifolioInfo, isLoading: isLoadingPortifolioInfo, isError: isErrorPortifolioInfo } = usePortifolio(userId)

    const orderListFiltered = filtarListaDeOrdens(inputFilter.toUpperCase(), ordens ?? [])
    const totalInvestidoEmCentavos = portifolioInfo?.totalInvestidoNaCarteiraEmCentavos ?? 0
    const logourlPorAtivos = portifolioInfo?.logourlPorAtivos ?? {}
    const assetsForSale = logourlPorAtivos

    const isLoading = isLoadingOrdens || isLoadingPortifolioInfo
    const isError = isErrorOrdens || isErrorPortifolioInfo

    if(isError) return <p className="text-my-foreground-secondary p-6">Erro durante o carregamento!</p>

    return(
        <div className="flex flex-col gap-3 flex-1 w-full min-h-[calc(100dvh-210px)] text-my-foreground-secondary p-3">
            <LoadingSpinner isLoading={isLoading} size="xl" className="text-lime-base/50" />
            <Display>
                <DisplayHeader>
                    <DisplayTitle className="text-base">Total investido</DisplayTitle>
                </DisplayHeader>
                <DisplayBody>
                    <DisplayContent>
                        <DisplayItem>
                            <MoedaEmReal
                                centavos={totalInvestidoEmCentavos}
                            />
                        </DisplayItem>
                    </DisplayContent>
                </DisplayBody>
            </Display>
            
            <div className="flex items-center justify-between gap-3">
                
                
                <div className="flex w-full gap-3">
                    <YearPicker  
                        value={year}
                        onChange={setYear}
                    />
                    
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary opacity-60" />
                        <Input 
                            className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border border-[#29292E] focus:!ring-[1px] ml-0.5 pl-10 pr-4"
                            placeholder="Buscar por data, ativo, tipo ou operação..."
                            value={inputFilter}
                            onChange={(e) => {setInputFilter(e.target.value)}}
                        />
                    </div>
                </div>

                <Display className="">
                    <DisplayBody className="flex h-full items-center">
                        <DisplayContent>
                            
                            <DialogCreateOrder
                                userId={userId}
                                assetsForSale={assetsForSale}
                            />
                            
                        </DisplayContent>
                    </DisplayBody>
                </Display>
            </div>

            <div className="flex flex-col w-full h-full gap-3">
                <div className="flex w-full h-full">
                    
                    <div className="flex grow w-full h-[calc(100dvh-235px)] overflow-y-auto overflow-x-hidden border-[#29292E] border rounded-md p-2 custom-scrollbar-div">
                        
                        <TableOrders
                            orderListFiltered={orderListFiltered ?? []}
                            logoUrlPorAtivos={logourlPorAtivos}
                        />
                        
                    </div>
                </div>    
            </div>          
        </div>
    )
}