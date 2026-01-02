import CarteiraDeAlocacaoCompleta from "@/components/barra-alocacao";
import { Display, DisplayBody, DisplayContent, DisplayHeader, DisplayItem, DisplayTitle } from "@/components/display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MoedaEmReal } from "@/components/moeda-percentual";
import { usePlanning } from "@/queries/planning";
import { usePortifolio } from "@/queries/portifolio";
import { removeAuthToken } from "@/repositories/localStorageAuth";
import { queryClient } from "@/services/queryClient";
import { dataChartMinhaCarteiraDeAtivosPlanejada, dataChartMinhaCarteiraDeAtivos } from "@/utils/assets.utils";
import { showErrorToast } from "@/utils/toasts";
import { useNavigate } from "react-router";

export default function HomePage() {

        const navigate = useNavigate()

        const { data: portifolioInfo, isLoading: isLoadingPortifolioInfo, isError: isErrorPortifolioInfo, error: errorPortifolioInfo } = usePortifolio()

        const posicaoAtualEmCentavos = portifolioInfo?.posicaoAtualDaCarteiraEmCentavos ?? 0
        const resultadoEmCentavos = portifolioInfo?.resultadoDaCarteiraEmCentavos ?? 0
        const resultadoPercentual = portifolioInfo?.resultadoDaCarteiraEmPercentual
        const resultadoEhNegativo = parseFloat(resultadoPercentual ?? "0") < 0
        const resultadoEhZero = parseFloat(resultadoPercentual ?? "0") === 0

        const { data: planningInfo, isLoading: isLoadingPlanningInfo, isError: isErrorPlanningInfo, error: errorPlanningInfo } = usePlanning(0)

        const isLoading = isLoadingPortifolioInfo || isLoadingPlanningInfo
        const isError = isErrorPortifolioInfo || isErrorPlanningInfo
        const error = errorPlanningInfo || errorPortifolioInfo

        const handleLogout = () => {
            removeAuthToken()
            queryClient.clear()
            navigate('/')
        }

        if(isError && error?.message) {
            showErrorToast(error?.message)
        }

        if(error?.message === "O seu token expirou") {
            handleLogout()
        }

    return(
        <div className="flex gap-3 flex-wrap flex-1 w-full h-full text-my-foreground-secondary p-3 overflow-y-hidden">
            <LoadingSpinner isLoading={isLoading} size="xl" className="text-lime-base/50" />

            <Display className="w-full">
                <DisplayHeader>
                    <DisplayTitle className="text-base">Minha posição</DisplayTitle>
                </DisplayHeader>
                <DisplayBody>
                    <DisplayContent>
                        <DisplayItem>
                            <MoedaEmReal centavos={posicaoAtualEmCentavos} />
                        </DisplayItem>
                        <DisplayContent className="flex-row">
                            <DisplayItem className="!text-sm">
                                <MoedaEmReal centavos={resultadoEmCentavos} />
                            </DisplayItem>
                            <DisplayItem className={`flex gap-0 items-center !text-sm ${ resultadoEhZero ? "text-my-foreground-secondary" : resultadoEhNegativo ? 'text-red-destructive' : 'text-green-base' }`}>
                                <span className="text-my-foreground-secondary">(</span>
                                { !resultadoEhZero && <span className="material-symbols-outlined select-none">
                                    { resultadoEhNegativo ? "arrow_drop_down" : "arrow_drop_up"}
                                </span>}
                                    {resultadoPercentual}
                                <span className="text-my-foreground-secondary pl-1">)</span>
                            </DisplayItem>
                        </DisplayContent>
                    </DisplayContent>
                </DisplayBody>
            </Display>

            <div className="grid grid-flow-col grid-cols-2 w-full h-[calc(100dvh-215px)] overflow-y-auto custom-scrollbar-div">
                <CarteiraDeAlocacaoCompleta 
                    ativosIniciais={dataChartMinhaCarteiraDeAtivos(
                                planningInfo?.ativosPlanejadosConsolidados ?? []
                            )} 
                    title="Alocalção Atual da Carteira" 
                />
                <div className="cursor-pointer" onClick={()=> navigate('/carteira/rebalanceamento')}>
                    <CarteiraDeAlocacaoCompleta 
                        ativosIniciais={dataChartMinhaCarteiraDeAtivosPlanejada(
                            planningInfo?.ativosPlanejadosConsolidados ?? []
                        )} 
                        title="Carteira Planejada" 
                    />
                </div>
            </div>
        </div>
    )
}