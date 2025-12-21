import { Display, DisplayBody, DisplayContent, DisplayHeader, DisplayItem, DisplayTitle } from "@/components/display"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MoedaEmReal } from "@/components/moeda-percentual"
import { AuthContext } from "@/contexts/auth.context"
import { useAssets } from "@/queries/asset"
import { usePortifolio } from "@/queries/portifolio"
import { showErrorToast } from "@/utils/toasts"
import { useContext } from "react"
import emptyWallet from "../../assets/images/empty-wallet-removebg-preview.png"

export default function MeusDividendos() {

    const { loginResponse } = useContext(AuthContext)
    const userId = loginResponse?.objetoResposta.id || ""

    const { data: ativos, isLoading: isLoadingAtivos, isError: isErrorAtivos, error: errorAtivos } = useAssets(userId)
    const { data: portifolioInfo, isLoading: isLoadingPortifolioInfo, isError: isErrorPortifolioInfo, error: errorPortifolioInfo } = usePortifolio(userId)

    const posicaoAtualEmCentavos = portifolioInfo?.posicaoAtualDaCarteiraEmCentavos ?? 0
    const resultadoEmCentavos = portifolioInfo?.resultadoDaCarteiraEmCentavos ?? 0
    const resultadoPercentual = portifolioInfo?.resultadoDaCarteiraEmPercentual
    const resultadoEhNegativo = parseFloat(resultadoPercentual ?? "0") < 0
    const resultadoEhZero = parseFloat(resultadoPercentual ?? "0") === 0


    const isLoading = isLoadingAtivos || isLoadingPortifolioInfo
    const isError = isErrorAtivos || isErrorPortifolioInfo
    const error = errorAtivos || errorPortifolioInfo

    if(isError) {
        if(error && error.message) {
            showErrorToast(error.message || "Falha ao carregar as informações.")
        }
    }

    return(
        <div className="flex flex-col gap-3 flex-1 w-full h-full text-my-foreground-secondary p-3">
            <LoadingSpinner isLoading={isLoading} size="xl" className="text-lime-base/50" />

            <Display>
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
            
            {
                !ativos || ativos.length === 0 &&
                    <div className="flex flex-col gap-3 w-full h-full items-center justify-center rounded-md bg-my-background" style={{backgroundImage: emptyWallet}}>
                        <img src={emptyWallet} alt="Empty Wallet" width={300} />
                        <span className="text-my-foreground/30 text-center font-bold text-3xl">Sua carteira de investimentos <br/> está vazia</span>
                    </div>
            }
            
            <div className="flex gap-3 justify-start flex-wrap w-full overflow-y-auto custom-scrollbar-div">
                {/* INSERIR CONTEUDO AQUI */}
            </div>
        </div>
    )
}