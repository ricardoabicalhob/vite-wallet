import MonthPicker from "@/components/calendar-month-picker"
import ComboboxTradeModality from "@/components/combobox-trade-modality"
import { Display, DisplayBody, DisplayContent, DisplayItem, DisplayHeader, DisplayTitle, DisplayIcon } from "@/components/display"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MoedaEmReal } from "@/components/moeda-percentual"
import { TableTaxes } from "@/components/table-taxes"
import { Button } from "@/components/ui/button"
import { SystemContext } from "@/contexts/system.context"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import type { ProcessFiscalResultResponse } from "@/interfaces/processFiscalResult.interface"
import type { TaxesI } from "@/interfaces/taxes.interface"
import { cn } from "@/lib/utils"
import { useProcessFiscalResult } from "@/queries/processFiscalResult"
import { useTaxes } from "@/queries/taxes"
import { formatPeriodoApuracaoToString } from "@/utils/formatters"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { useContext } from "react"

export default function Impostos() {

    const modalities = {
        "swing_trade": "Swing Trade",
        "day_trade": "Day Trade"
    }

    const { 
        tradeModality, 
        setTradeModality,
        selectedDate,
        setSelectedDate,
        selectedYear
    } = useContext(SystemContext)

    // const [ selectedDate, setSelectedDate ] = useState<Date | undefined>(new Date())
    const selectedMonth = selectedDate ? selectedDate.getMonth() : undefined
    // const selectedYear = selectedDate ? selectedDate.getFullYear() : undefined
    
    const { data: taxesInfo, isLoading: isLoadingTaxesInfo, isError: isErrorTaxesInfo } = useTaxes(selectedYear, selectedMonth, tradeModality)
    const { mutate: executeProcessFiscalResult } = useProcessFiscalResult()

    const receitaBrutaTotalEmCentavos = taxesInfo?.receitaBrutaTotalComVendaEmCentavos ?? 0
    const custoAquisicaoTotalEmCentavos = taxesInfo?.custoDeAquisicaoTotalDosAtivosEmCentavos ?? 0
    const ganhoCapitalTotalEmCentavos = taxesInfo?.ganhoDeCapitalTotalComAVendaDosAtivosEmCentavos ?? 0
    const irDevidoEmCentavos = taxesInfo?.impostoDeRendaSobreGanhoDeCapitalEmCentavos ?? 0
    const irrfSomadoEmCentavos = taxesInfo?.irrfTotalSobreOrdensDeVendaEmCentavos ?? 0

    const emptyTaxesInfo :TaxesI = {
        ativosConsolidados: [],
        custoDeAquisicaoTotalDosAtivosEmCentavos: 0,
        ganhoDeCapitalTotalComAVendaDosAtivosEmCentavos: 0,
        impostoDeRendaSobreGanhoDeCapitalEmCentavos: 0,
        irrfTotalSobreOrdensDeVendaEmCentavos: 0,
        receitaBrutaTotalComVendaEmCentavos: 0,
        receitaLiquidaContabilTotalComVendaEmCentavos: 0,
        receitaLiquidaOperacionalTotalComVendaEmCentavos: 0
    }

    const isPrejuizo = ganhoCapitalTotalEmCentavos < 0

    const displayCards = [
        {
            title: "Total de vendas",
            icon: "",
            valueInCentavos: receitaBrutaTotalEmCentavos,
            valueClassName: "text-my-foreground-secondary text-left"
        },
        {
            title: "Custo de aquisição total",
            icon: "attach_money",
            valueInCentavos: custoAquisicaoTotalEmCentavos,
            valueClassName: "text-my-foreground-secondary !text-lg text-left"
        },
        {
            title: isPrejuizo ? "Prejuízo a compensar" : "Ganho de capital",
            icon: isPrejuizo ? "trending_down" : "trending_up",
            valueInCentavos: ganhoCapitalTotalEmCentavos,
            valueClassName: cn("!text-lg text-left text-my-foreground", isPrejuizo ? "text-red-destructive font-bold" : "text-lime-base/50 font-bold")
        },
        {
            title: isPrejuizo ? "IRRF (Crédito)" : `Imposto de renda DARF (${tradeModality === "swing_trade" ? "15%" : "20%"} deduzido IRRF)`,
            icon: "percent",
            valueInCentavos:irDevidoEmCentavos === 0 
                ? (isPrejuizo 
                    ? irrfSomadoEmCentavos 
                    : 0) 
                : (irDevidoEmCentavos - irrfSomadoEmCentavos),
            valueClassName: cn("!text-lg text-left text-my-foreground", isPrejuizo ? "text-lime-base/50" : (irDevidoEmCentavos > 0 ? "text-yellow-500/50" : "text-my-foreground"))
        }
    ]

    const handleProcessFiscalResult = () => {
        if(!selectedYear || !selectedMonth || !tradeModality) {
            throw new Error("Preencha todos os campos!")
        }
        
        executeProcessFiscalResult({selectedYear, selectedMonth, tradeModality}, {
            onSuccess: (processFiscalResult :ProcessFiscalResultResponse) => {
                if(processFiscalResult.type === "DARF") {
                    showSuccesToast(`DARF de ${ modalities[processFiscalResult.data.modality as TradeModality]} para o período de apuração ${formatPeriodoApuracaoToString(processFiscalResult.data.periodoApuracao)} criada!`)
                }else if(processFiscalResult.type === "COMPENSATION") {
                    showSuccesToast(`Compensação de ${ modalities[processFiscalResult.data.modality as TradeModality]} para o período de apuração ${formatPeriodoApuracaoToString(processFiscalResult.data.periodoApuracao)} criada!`)
                }
                
            },
            onError: (errorExecuteProcessFiscalResult) => {
                showErrorToast(errorExecuteProcessFiscalResult.message)
            }
        })
    }

    const isLoading = isLoadingTaxesInfo
    const isError = isErrorTaxesInfo

    if(isError) {
        showErrorToast("Falha no carregamento das informações da BRAPI")
    }

    return(
        <div className="flex gap-3 flex-1 w-full h-full text-my-foreground-secondary p-3">
            <LoadingSpinner isLoading={isLoading} message="Carregando ordens de venda..." size="xl" className="text-lime-base/50" />
            
            <div className="flex flex-col gap-3">

                <ComboboxTradeModality
                    tradeModality={tradeModality}
                    setTradeModality={setTradeModality}
                />

                <MonthPicker
                    date={selectedDate}
                    setDate={setSelectedDate}
                />

                {
                    taxesInfo && displayCards.map(card => (
                        <Display key={card.title}>
                            <DisplayHeader className="flex gap-2 items-center">
                                {
                                    card.icon &&
                                        <DisplayItem className="flex items-center justify-center !py-2 w-6 h-6 bg-zinc-800 rounded-md">
                                            <DisplayIcon className="!text-bold !text-xl text-center align-middle">{card.icon}</DisplayIcon>
                                        </DisplayItem>    
                                }     
                                <DisplayTitle>{card.title}</DisplayTitle>
                            </DisplayHeader>
                            <DisplayBody>
                                <DisplayContent>
                                    <DisplayItem className={card.valueClassName}>
                                        <MoedaEmReal centavos={card.valueInCentavos} />
                                    </DisplayItem>
                                </DisplayContent>
                            </DisplayBody>
                        </Display>
                    ))
                }
                {
                    ganhoCapitalTotalEmCentavos > 0 &&
                    <Display>
                        <DisplayHeader className="flex gap-2 items-center">
                            <DisplayItem className="flex items-center justify-center !py-2 w-6 h-6 bg-zinc-800 rounded-md">
                                <DisplayIcon className="!text-bold !text-xl text-center align-middle">payments</DisplayIcon>
                            </DisplayItem>
                            <DisplayTitle>IRRF (Imposto Retido na Fonte)</DisplayTitle>
                        </DisplayHeader>
                        <DisplayBody>
                            <DisplayContent>
                                <DisplayItem className="text-my-foreground !text-lg text-left">
                                    <MoedaEmReal centavos={irrfSomadoEmCentavos} />
                                </DisplayItem>
                            </DisplayContent>
                        </DisplayBody>
                    </Display>
                }
                
                <Button
                    id="processar-resultado-fiscal"
                    variant="outline"
                    className={cn(
                        "w-full justify-center focus:!ring-[1px] text-my-background-secondary bg-lime-base hover:bg-lime-base hover:brightness-110 border-0 cursor-pointer",
                    )}
                    onClick={handleProcessFiscalResult}
                >
                    <span className="material-symbols-outlined">conveyor_belt</span>
                    Processar resultado
                </Button>

            </div>
            <div className="flex flex-col grow w-full overflow-y-auto overflow-x-hidden border-[#29292E] border rounded-md p-2 custom-scrollbar-div">             
                <span className="text-xl font-semibold px-4">Ativos consolidados</span>
                <TableTaxes
                    taxesInfo={taxesInfo ?? emptyTaxesInfo}
                />
            </div>
        </div>
    )
}