import { DialogCreateRecommendedAsset } from "@/components/dialog-create-recommended-asset"
import { Display, DisplayBody, DisplayContent, DisplayHeader, DisplayItem, DisplayTitle } from "@/components/display"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MoedaEmReal } from "@/components/moeda-percentual"
import { TableRecommendedAsset } from "@/components/table-recommended-asset"
import { Input } from "@/components/ui/input"
import { AuthContext } from "@/contexts/auth.context"
import type { AtivoPlanejadoConsolidado } from "@/interfaces/ativoPlanejadoConsolidado.interface"
import { useOrders } from "@/queries/order"
import { usePlanning } from "@/queries/planning"
import { formatCentavosToReal, formatWhileTyping } from "@/utils/formatters"
import { showErrorToast } from "@/utils/toasts"
import { useContext, useEffect, useState } from "react"

export default function Rebalanceamento() {
    const { loginResponse } = useContext(AuthContext)
    const userId = loginResponse?.objetoResposta.id || ""

    
    const [ centavosInvestment, setCentavosInvestment ] = useState<number>(0)
    const [ displayValue, setDisplayValue ] = useState("")
    const [ queryInvestment, setQueryInvestment ] = useState(0)
    
    const { data: ordens, isLoading: isLoadingOrdens, isError: isErrorOrdens } = useOrders()

    const { data: planningSumary, isLoading: isLoadingPlanning } = usePlanning(queryInvestment)

    const patrimonio = planningSumary?.posicaoAtualDaCarteiraEmCentavos ?? 0
    const ativosPlanejadosConsolidados = planningSumary?.ativosPlanejadosConsolidados ?? []

    const handleChangeInvestment = (e :React.ChangeEvent<HTMLInputElement>) => {
        const { centavos, display } = formatWhileTyping(e.target.value)

        if(centavos < 0 && patrimonio - Math.abs(centavos) < 0) {
            setCentavosInvestment(-(patrimonio))
            setDisplayValue(formatCentavosToReal(-patrimonio))
            showErrorToast("O valor da retirada não pode ser maior que o seu patrimônio.")
            return
        }

        setCentavosInvestment(centavos)
        setDisplayValue(display)
    }

    const handleFetchPlanning = () => {
        if(Math.abs(centavosInvestment) > patrimonio) {
            showErrorToast("O valor da retirada não pode ser maior que o seu patrimônio.")
            return
        }
        
        setQueryInvestment(centavosInvestment)
    }

    const emptyAtivoPlanejadoConsolidado :AtivoPlanejadoConsolidado = {
            id: "",
            shortName: "",
            logoUrl: "",
            symbol: "",
            percentualAtual: "",
            posicaoAtualEmCentavos: 0,
            percentualPlanjado: "",
            posicaoPlajadaEmCentavos: 0,
            valorDeAjusteEmCentavos: 0,
            recomendacaoDe: "neutro"
        }

    const isLoading = isLoadingOrdens || isLoadingPlanning
    const isError = isErrorOrdens

    useEffect(()=> {
        if(userId) {
            setQueryInvestment(0)
        }
    }, [userId])

    if(isError) return <p className="text-my-foreground-secondary p-6">Erro durante o carregamento!</p>

    return(
        <div className="flex flex-col gap-3 flex-1 w-full h-full text-my-foreground-secondary p-3">
            <LoadingSpinner isLoading={isLoading} size="xl" className="text-lime-base/50" />
            
            <Display>
                <DisplayHeader>
                    <DisplayTitle className="text-base">Meu patrimônio</DisplayTitle>
                </DisplayHeader>
                <DisplayBody>
                    <DisplayContent>
                        <DisplayItem className={ `${Math.abs(centavosInvestment) > 0 ? 'text-lime-base/80' : 'text-my-foreground-secondary'}` }>
                            <MoedaEmReal
                                centavos={ patrimonio + centavosInvestment }
                            />
                        </DisplayItem>
                    </DisplayContent>
                </DisplayBody>
            </Display>
            <div className="flex flex-col w-full h-full">

                <div className="flex items-center justify-between gap-2">

                    <div className="relative w-full">
                        <span className="absolute left-3 top-3.5 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary opacity-60 material-symbols-outlined" >payments</span>
                        <Input 
                            className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border border-[#29292E] focus:!ring-[1px] ml-0.5 pl-10 pr-4 hide-webkit-spinners"
                            placeholder="Informe o valor de aporte"
                            type="text"
                            maxLength={22}
                            value={displayValue}
                            onChange={handleChangeInvestment}
                        />

                        <span 
                            className="absolute right-3 top-[15px] -translate-y-1/2 w-5 h-5 bg-my-background-secondary text-my-foreground-secondary hover:text-lime-base font-bold cursor-pointer material-symbols-outlined"
                            onClick={handleFetchPlanning}    
                        >
                            reset_settings
                        </span>
                        
                    </div>

                    <Display className="items-end">
                        <DialogCreateRecommendedAsset
                            ativosPlanejadosConsolidados={ativosPlanejadosConsolidados}
                            userId={userId}
                            ordens={ordens || []}
                            myHeritage={planningSumary?.posicaoAtualDaCarteiraEmCentavos || 0}
                        />
                    </Display>
                </div>

                
                <div className="flex w-full h-full py-3">

                    <div className="flex grow w-full h-[calc(100dvh-235px)] overflow-x-hidden border-[#29292E] border rounded-md p-2 overflow-y-auto custom-scrollbar-div">

                        <TableRecommendedAsset
                            ativosPlanejadosConsolidados={
                                planningSumary?.ativosPlanejadosConsolidados || [emptyAtivoPlanejadoConsolidado]
                            }
                            userId={userId}
                        />
                        
                    </div>
                </div>    
            </div>
        </div>
    )
}