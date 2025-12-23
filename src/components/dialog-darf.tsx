import { useContext, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import type { DarfI } from "@/interfaces/darf.interface"
import logoDarf from '../../src/assets/images/logo-darf.png'
import { MoedaEmReal } from "./moeda-percentual"
import { AuthContext } from "@/contexts/auth.context"
import { formatPeriodoApuracaoToString } from "@/utils/formatters"
import imgPaga from "../assets/images/pago-fundo-transparente.png"

interface DialogDarfProps {
    darf :DarfI
}

export function DialogDarf({
    darf
} :DialogDarfProps) {

    const { loginResponse } = useContext(AuthContext)
    const userName = loginResponse?.objetoResposta.name

    const [ isInfoDialogOpen, setIsInfoDialogOpen ] = useState(false)

    const modalities :{ [key in TradeModality] :string } = {
        day_trade: "Day Trade",
        swing_trade: "Swing Trade"
    }

    const darfsAcumuladas = darf.accumulatedDarfs?.filter(currentDarf => currentDarf.id !== darf.id)

    return(
        <Dialog open={isInfoDialogOpen} onOpenChange={(open)=> {
            setIsInfoDialogOpen(open)

            // if(open) {
            //     setAssetSymbol(darf.symbol)
            //     setOrderDate(darf.orderDate)
            // }
        }}>
            <div>
                <DialogTrigger asChild>
                    <button
                        onClick={()=> {}}
                        className={`material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full ${darf.abaixoDoLimiteMinimo ? 'pointer-events-none text-my-foreground' : 'cursor-pointer'}`} 
                        style={{fontSize: 22}}                                                
                    >
                        visibility
                    </button>
                </DialogTrigger>
                <DialogContent 
                    className="!w-[780px] !max-w-[780px] !h-[620px] bg-white border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary"
                >
                <DialogHeader>
                    <DialogTitle className="text-my-background-secondary">Documento de Arrecadação de Receitas Federais</DialogTitle>
                    <DialogDescription className="text-my-background-secondary">Incidência de imposto sobre as suas operações <span className="font-bold italic">{ modalities[darf.modality] }</span></DialogDescription>
                </DialogHeader>
                <div className="relative grid gap-4">
                    {
                        darf.paga &&
                        <div className="absolute bottom-6 right-6">
                            <img src={imgPaga} className="w-[240px]"/>
                        </div>
                    }
                    
                    <div className="w-full max-w-4xl mx-auto font-sans text-[11px]">
                        
                        <div className="grid grid-cols-4 grid-rows-15 w-auto h-[500px] border-[0.5px] border-my-foreground/50">
                            <div className="col-span-2 row-span-12 bg-my-foreground border-my-foreground grid grid-rows-12">
                                
                                <div className="bg-my-foreground-accent row-span-5 grid grid-rows-10">
                                    <div className="flex gap-2 bg-my-foreground-accent row-span-7 p-2 border-[0.5px] border-my-foreground/50">
                                        <img src={logoDarf} alt="logo-darf" className="w-12 h-12" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base font-bold">MINISTÉRIO DA FAZENDA</span>
                                            <span className="text-xs">SECRETARIA DA RECEITA FEDERAL DO BRASIL</span>
                                            <span className="text-xs">Documento de Arrecadação de Receitas Federais</span>
                                            <span className="text-xl font-bold">DARF</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col row-span-3 border-[0.5px] border-t-my-foreground/50">
                                        <div className="flex items-start gap-1 px-1 ">
                                            <span className="text-[16px] font-bold align-text-top">01</span>
                                            <span className="text-[10px] pt-1">NOME / TELEFONE</span>
                                        </div>
                                        <span className="self-center text-base italic font-semibold">{ userName }</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-my-foreground-accent row-span-2 border-[0.5px] border-my-foreground/50">
                                    <span className="text-sm font-bold">Veja no verso</span>
                                    <span className="text-sm font-bold">instruções para preenchimento</span>
                                </div>
                                <div className="flex flex-col py-4 gap-2 bg-my-foreground-accent row-span-5 border-[0.5px] border-my-foreground/50">
                                    <span className="font-bold self-center text-base">ATENÇÃO</span>
                                    <p className="px-3 text-[12px] text-justify">
                                        É vedado o recolhimento de tributos administrados pela Secretaria da Receita Federal do Brasil (RFB) cujo valor total seja inferior a R$ 10,00. 
                                        Ocorrendo tal situação, adicione esse valor ao tributo de mesmo código de períodos subsequentes, até que o total seja igual ou superior a R$ 10,00. 
                                    </p>
                                </div>

                            </div>

                            {/* COLUNA DIREITA — também vira grid interno de 12 linhas */}
                            <div className="grid-cols-2 col-span-2 row-span-12 border-my-foreground grid grid-rows-12">

                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">02</span>
                                    <span className="text-[10px] pt-1">PERÍODO DE APURAÇÃO</span>
                                </div>

                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">{ formatPeriodoApuracaoToString(darf.periodoApuracao) }</div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">03</span>
                                    <span className="text-[10px] pt-1">NÚMERO DO CPF OU CNPJ</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">-</div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">04</span>
                                    <span className="text-[10px] pt-1">CÓDIGO DA RECEITA</span>
                                </div>

                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">{ darf.codReceita }</div>

                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">05</span>
                                    <span className="text-[10px] pt-1">NÚMERO DE REFERÊNCIA</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">-</div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">06</span>
                                    <span className="text-[10px] pt-1">DATA DE VENCIMENTO</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">{ new Date(darf.dueDate).toLocaleDateString('pt-BR') }</div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">07</span>
                                    <span className="text-[10px] pt-1">VALOR DO PRINCIPAL</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">
                                    <MoedaEmReal centavos={ darf.valorDoPrincipal } />
                                </div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">08</span>
                                    <span className="text-[10px] pt-1">VALOR DA MULTA</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">
                                    <MoedaEmReal centavos={ darf.valorDaMulta } />
                                </div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">09</span>
                                    <span className="text-[10px] pt-1">VALOR DOS JUROS E/OU ENCARGOS DL - 1.025/69</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">
                                    <MoedaEmReal centavos={ darf.valorJurosEncargos } />
                                </div>
                                
                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">10</span>
                                    <span className="text-[10px] pt-1">VALOR TOTAL</span>
                                </div>
                                
                                <div className="bg-my-foreground-accent text-sm font-semibold text-center flex justify-center items-center border-[0.5px] border-my-foreground/50 h-full">
                                    <MoedaEmReal centavos={ darf.valorTotal } />
                                </div>

                                <div className="flex items-start gap-1 px-1 bg-my-foreground-accent col-span-2 row-span-3 text-[16px] border-[0.5px] border-my-foreground/50">
                                    <span className="text-[16px] font-bold align-text-top">11</span>
                                    <span className="text-[10px] pt-1">AUTENTICAÇÃO BANCÁRIA (Somente nas 1ª e 2ª vias)</span>
                                </div>

                            </div>

                            <div className="flex flex-col flex-wrap h-[100px] col-span-4 px-3 py-1">
                                <span className="text-[10px] font-bold">OBSERVAÇÕES</span>
                                {
                                    darfsAcumuladas && 
                                    darfsAcumuladas.length > 0 &&
                                    <div>
                                        <span>Valores acumulados incluídos:</span>
                                        {
                                            darfsAcumuladas.map(darf => {
                                                return(
                                                    <div className="flex gap-2">
                                                        <span className="tabular-nums">Período de apuração: { formatPeriodoApuracaoToString(darf.periodoApuracao) }</span>
                                                        <span>{ modalities[darf.modality] }</span>
                                                        <span><MoedaEmReal className="tabular-nums" centavos={darf.valorTotal} /></span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>


                    </div>
                    
                </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}