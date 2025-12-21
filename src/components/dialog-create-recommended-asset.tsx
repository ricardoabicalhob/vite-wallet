import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { DisplayIcon } from "./display"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import type { OrderPresenter } from "@/interfaces/order.interface"
import type { ApiResponse } from "@/interfaces/quote.interface"
import { dataChartMinhaCarteiraDeAtivosPlanejada, obterQuantidadeAtualDeAcoesDeUmAtivo, removeTrailingF } from "@/utils/assets.utils"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import type { RecommendedAssetCreate } from "@/interfaces/recommendedAsset.interface"
import { AxiosError } from "axios"
import { publicApi } from "@/services/api"
import { useCreateRecommendedAsset } from "@/queries/recommendedAsset"
import { Porcento } from "./moeda-percentual"
import type { AtivoPlanejadoConsolidado } from "@/interfaces/ativoPlanejadoConsolidado.interface"
import { MiniLoadingSpinner } from "./mini-loading-spinner"

interface DialogRecommendedAssetProps {
    userId :string
    ordens :OrderPresenter[]
    ativosPlanejadosConsolidados :AtivoPlanejadoConsolidado[]
    myHeritage :number
}

export function DialogCreateRecommendedAsset({
    userId,
    ordens,
    ativosPlanejadosConsolidados,
    myHeritage,
} :DialogRecommendedAssetProps) {

    const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false)

    const [ assetSymbol, setAssetSymbol ] = useState<string>("")
    const [ plannedPercentage, setPlannedPercentage ] = useState<number>(0)
    const [ amount, setAmount ] = useState<number>(0)
    const [ recommendedValue, setRecommendedValue ] = useState<number>(0)
    const [ unitPrice, setUnitPrice ] = useState<number>(0)
    const [ assetLogourl, setAssetLogourl ] = useState<string>()
    const [ isValidatingAsset, setIsValidatingAsset ] = useState(false)


    const espacoLiberadoInicial = dataChartMinhaCarteiraDeAtivosPlanejada(ativosPlanejadosConsolidados).reverse()[0].assetWeight
    const [ espacoLiberado, setEspacoLiberado ] = useState<number>(parseFloat(espacoLiberadoInicial))
    
    const valueToBeAdjusted = useMemo(()=> {
            if(plannedPercentage === undefined) return 0
            return recommendedValue - (amount * unitPrice)
        }, [recommendedValue, amount, unitPrice])

    const { mutate: createRecommendedAsset } = useCreateRecommendedAsset()

    function resetForm() {
        setAssetSymbol("")
        setPlannedPercentage(0)
        setAmount(0)
        setRecommendedValue(0)
        setUnitPrice(0)
    }

    async function validateSymbol(symbol :string) {
        const token = import.meta.env.VITE_BRAPI_API_KEY

        const assetSymbolRemovedTrailingF = removeTrailingF(symbol)

        try {
            setIsValidatingAsset(true)
            const response = await publicApi.get(`https://brapi.dev/api/quote/${assetSymbolRemovedTrailingF}?token=${token}`)
            const data :ApiResponse = response.data

            if(ativosPlanejadosConsolidados.find(ativo => ativo.symbol === data.results[0].symbol)) {
                setIsValidatingAsset(false)
                showErrorToast(`Você já possui ${data.results[0].symbol} em seu planejamento!`)
                return
            }

            setAssetSymbol(data.results[0].symbol)
            setAssetLogourl(data.results[0].logourl)
            setUnitPrice(data.results[0].regularMarketPrice)
            setIsValidatingAsset(false)
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                showErrorToast(error.response?.data.message)
            }
            setIsValidatingAsset(false)
        }
    }

    function handleSubmit(e :React.FormEvent) {
        e.preventDefault()
        
        if( assetSymbol === null || plannedPercentage === null) {
            showErrorToast("Preencha todos os campos!")
            return
        }

        const recommendedAssetToCreate :RecommendedAssetCreate = {
            recommendedAssetSymbol: removeTrailingF(assetSymbol),
            plannedPercentage: plannedPercentage * 1000,
            amount: 0,
            userId: userId
        }

        createRecommendedAsset(recommendedAssetToCreate, {
            onError: (errorCreateRecommendedAsset) => {
                showErrorToast(errorCreateRecommendedAsset.message)
            },
            onSuccess: ()=> {
                showSuccesToast(`${removeTrailingF(assetSymbol)} - Ativo incluído na carteira recomendada!`)
                resetForm()
                setIsCreateDialogOpen(false)
            }
        })
    }

    useEffect(() => {
        if(plannedPercentage) {
            const novoEspaco = Math.max(parseFloat(espacoLiberadoInicial) - (plannedPercentage), 0)
            setEspacoLiberado(novoEspaco)
        } else {
            setEspacoLiberado(parseFloat(espacoLiberadoInicial))
        }
    }, [plannedPercentage, espacoLiberadoInicial])

    useEffect(()=> {
        if(ordens) {
            const currentAmount = obterQuantidadeAtualDeAcoesDeUmAtivo(ordens, userId, removeTrailingF(assetSymbol))
            setAmount(currentAmount)

            if(!plannedPercentage) {
                setRecommendedValue(0)
            } else {
                setRecommendedValue(((myHeritage) * plannedPercentage) / 10000)
            }
        }
    }, [assetSymbol, ordens, plannedPercentage])

    useEffect(()=> {
        if(!assetSymbol) {
            setAssetLogourl("") 
        }
    }, [assetSymbol])
    
    return(
        <Dialog open={isCreateDialogOpen}>
            <DialogTrigger asChild>
                <DisplayIcon
                    onClick={() => setIsCreateDialogOpen(true)}
                >format_list_bulleted_add</DisplayIcon>
            </DialogTrigger>
            <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} className="sm:max-w-[600px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary">
            <DialogHeader>
                <DialogTitle className="text-my-foreground-secondary">Nova ativo</DialogTitle>
                <div className="flex items-center justify-between gap-2">
                    <DialogDescription>
                        Preencha as informações para o novo ativo. Clique em salvar quando terminar.
                    </DialogDescription>
                    { !!!assetLogourl && 
                        <div className="bg-my-background-secondary rounded-sm w-10 h-10 justify-self-center flex items-center justify-center">
                            <MiniLoadingSpinner size="sm" isLoading={isValidatingAsset} className="text-lime-base/50" />
                        </div> }
                    { assetLogourl && 
                        <img 
                            src={assetLogourl} 
                            alt="" 
                            className='rounded-sm w-10 h-10 justify-self-center bg-black 
                            shadow-[0_0_30px_5px_rgba(255,255,255,0.4)]
                            ring-0 ring-white/40
                            ring-offset-[2px] ring-offset-[#303028]
                            border border-white/20
                            backdrop-blur-sm' /> }
                </div>
            </DialogHeader>
            <div className="gap-4">
                <form id="form-new-recommended-asset" onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="asset-shortname" className="px-1 text-my-foreground-secondary">
                                Ativo
                            </Label>
                            <Input 
                                id="asset-shortname"
                                type="text"
                                placeholder="Nome do ativo"
                                value={assetSymbol}
                                onKeyDown={e => { if(e.key === 'Enter') e.preventDefault() }}
                                onChange={(e)=> setAssetSymbol(e.target.value)}
                                onBlur={(e)=> {
                                    validateSymbol(e.target.value)
                                }}
                                className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5"
                                onFocus={e => e.target.select()}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="current-value" className="px-1 text-my-foreground-secondary">
                                Valor atual
                            </Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm bg-my-background text-my-foreground-secondary cursor-no-drop">
                                { (amount * unitPrice).toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) || (0).toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) }
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="px-1 text-my-foreground-secondary">
                                Espaço disponível
                            </Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm bg-my-background text-green-base cursor-no-drop">
                                <Porcento percentual={espacoLiberado * 1000} />
                            </span>
                        </div>
                    </div>

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="planned-percentage" className="px-1 text-my-foreground-secondary">
                                Planejado (%)
                            </Label>
                            <Input 
                                id="planned-percentage"
                                type="number"
                                placeholder="0"
                                step={"0.01"}
                                min={0}
                                max={100}
                                value={plannedPercentage}
                                onChange={(e)=> {setPlannedPercentage(parseFloat(e.target.value))}}
                                className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5 hide-webkit-spinners"
                                onFocus={e => e.target.select()}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="recommended-value" className="px-1 text-my-foreground-secondary">
                                Valor recomendado
                            </Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm bg-my-background text-my-foreground-secondary cursor-no-drop">
                                { recommendedValue.toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) || (0).toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) }
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="value-adjusted" className="px-1 text-my-foreground-secondary">
                                Valor a ajustar
                            </Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm bg-my-background text-my-foreground-secondary cursor-no-drop">
                                { valueToBeAdjusted.toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) || (0).toLocaleString('pt-BR', {style: "currency", currency: "BRL"}) }
                            </span>
                        </div>
                    </div>
                    
                </form>
                <Separator className="bg-my-background-secondary"/>
            </div>
            
            <DialogFooter>
                <DialogClose asChild>
                    <Button 
                        onClick={()=> {
                            setIsCreateDialogOpen(false)
                            resetForm()
                        }} 
                        className="bg-lime-base hover:bg-lime-secondary border-none cursor-pointer text-white font-bold hover:text-white" 
                        variant="outline"
                    >
                        Cancelar
                    </Button>
                </DialogClose>
                <Button className="bg-my-background-secondary text-my-foreground-secondary cursor-pointer" form="form-new-recommended-asset" type="submit">Salvar</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}