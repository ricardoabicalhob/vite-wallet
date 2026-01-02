import { useRef, useState } from "react"
import Calendar24 from "./calendar-24"
import ComboboxAssetType from "./combobox-asset-type"
import ComboboxOperationType from "./combobox-operation-type"
import { DisplayIcon } from "./display"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { removeTrailingF } from "@/utils/assets.utils"
import type { AssetType, OperationType, OrderCreate } from "@/interfaces/order.interface"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { useCreateOrder } from "@/queries/order"
import { AxiosError } from "axios"
import ComboboxAssetsForSale from "./combobox-assets-for-sale"
import { useFocusOnOpen } from "@/hooks/useFocusOnOpen"
import { useUpdateLogoOnSale } from "@/hooks/useUpdateLogoOnSale"
import { useClearSymbolOnOperationChange } from "@/hooks/useClearSymbolOnOperationChange"
import { formatCentavosToReal, parseInputToCentavos } from "@/utils/formatters"
import { useValidateAssetSymbol } from "@/queries/asset"

interface DialogCreateOrderProps {
    userId :string
    assetsForSale :Record<string, string>
}

export function DialogCreateOrder({
    userId,
    assetsForSale
} :DialogCreateOrderProps) {

    const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false)

    const [ date, setDate ] = useState<Date | undefined>(new Date())
    const [ assetSymbol, setAssetSymbol ] = useState<string>()
    const [ assetLogourl, setAssetLogourl ] = useState<string>()
    const [ amount, setAmount ] = useState<number>()
    const [ centavosFees, setCentavosFees ] = useState<string>("")
    const [ centavosTaxes, setCentavosTaxes ] = useState<string>("")
    const [ operationType, setOperationType ] = useState<"Compra" | "Venda">("Compra")
    const [ assetType, setAssetType ] = useState<"Acao" | "Fii" | "Cripto">("Acao")
    const [ centavosUnitPrice, setCentavosUnitPrice ] = useState<string>("")

    const assetSymbolInputRef = useRef<HTMLInputElement>(null)

    const { mutate: createOrder } = useCreateOrder()
    const { mutate: validateAssetSymbol } = useValidateAssetSymbol()


    const handleChangeUnitPrice = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosUnitPrice(centavos)
    }

    const handleChangeFees = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosFees(centavos)
    }


    async function validateSymbol(symbol :string) {
        
        validateAssetSymbol(symbol, {
            onSuccess: (validatedAsset) => {
                setAssetSymbol(validatedAsset.symbol)
                setAssetLogourl(validatedAsset.logoUrl)
            },
            onError: (error) => {
                if(error instanceof AxiosError) {
                    showErrorToast(error.response?.data.message)
                }
                setAssetSymbol("")
                setAssetLogourl("")
                showErrorToast(error.message)
            }
        })

        // const token = import.meta.env.VITE_BRAPI_API_KEY

        // try {
        //     // setIsValidatingAsset(true)
        //     const response = await publicApi.get(`https://brapi.dev/api/quote/${symbol}?token=${token}`)
        //     const data :ApiResponse = response.data

        //     setAssetSymbol(data.results[0].symbol)
        //     setAssetLogourl(data.results[0].logourl)
        //     // setIsValidatingAsset(false)
        // } catch (error :unknown) {
        //     if(error instanceof AxiosError) {
        //         showErrorToast(error.response?.data.message)
        //         setAssetSymbol("")
        //         setAssetLogourl("")
        //     }
        //     // setIsValidatingAsset(false)
        // }
    }

    function resetForm() {
        setDate(new Date())
        setAssetSymbol("")
        setAssetLogourl("")
        setAmount(0)
        setCentavosUnitPrice("")
        setCentavosFees("0.00")
        setCentavosTaxes("0.00")
        setOperationType("Compra")
        setAssetType("Acao")
    }

    function handleSubmit(e :React.FormEvent) {
        e.preventDefault()
        if(!date || !assetType || !assetSymbol || !amount || !operationType || !userId) {
            throw new Error("Preencha todos os campos!")
        }

        const feesInCents :number = parseInt(parseInputToCentavos(centavosFees))
        const unitPriceInCents :number = parseInt(parseInputToCentavos(centavosUnitPrice))

        const orderToCreate :OrderCreate = {
            orderDate: date,
            assetType: assetType.toLowerCase() as AssetType,
            symbol: removeTrailingF(assetSymbol),
            amount: amount,
            unitPrice: unitPriceInCents,
            fees: feesInCents,
            taxes: 0,
            operationType: operationType.toLowerCase() as OperationType,
            userId: userId,
            averagePrice: null
        }
        createOrder(orderToCreate, {
            onError: (errorCreateOrder) => {
                showErrorToast(errorCreateOrder.message)
            },
            onSuccess: (orderCreated)=> {
                setIsCreateDialogOpen(false)
                showSuccesToast(`${orderCreated?.symbol} - Ordem criada!`)
                resetForm()
            }
        })
    }

    useFocusOnOpen(assetSymbolInputRef, isCreateDialogOpen)

    useUpdateLogoOnSale(operationType, assetSymbol, assetsForSale, setAssetLogourl)

    useClearSymbolOnOperationChange(operationType, setAssetSymbol)

    return(
        <Dialog open={isCreateDialogOpen}>
            <DialogTrigger asChild>
                <DisplayIcon
                    onClick={() => setIsCreateDialogOpen(true)}
                >contextual_token_add</DisplayIcon>
            </DialogTrigger>
            <DialogContent
                // onOpenAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()} 
                className="sm:max-w-[600px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary"
            >
            <DialogHeader>
                <DialogTitle className="text-my-foreground-secondary">Nova ordem de negociação</DialogTitle>
                <div className="flex items-center justify-between gap-2">
                    <DialogDescription>
                        Preencha as informações para a nova ordem de negociação. Clique em salvar quando terminar.
                    </DialogDescription>
                    {/* { !!!assetLogourl &&
                        <div className="bg-my-background-secondary rounded-sm w-12 h-10 justify-self-center flex items-center justify-center">
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
                            backdrop-blur-sm' /> 
                    } */}
                </div>
            </DialogHeader>
            <div className="gap-4">
                <form id="form-new-order" onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <Calendar24 label="Data" date={date} setDate={setDate} />
                        <ComboboxOperationType operationType={operationType} setOperationType={setOperationType} />
                        <ComboboxAssetType assetType={assetType} setAssetType={setAssetType} />
                    </div>

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            { operationType === "Compra" &&
                                <>
                                    {/* <div className="flex justify-between items-center">
                                        <Label className="px-1 text-my-foreground-secondary">Ativo</Label>
                                        <div className="flex gap-1">
                                            <span className="text-xs mb-[-4px] text-lime-base">Atual</span>
                                            <MoedaEmReal className="text-xs mb-[-4px] text-lime-base" centavos={centavosCurrentPrice} parenteses={true} />
                                        </div>
                                    </div> */}
                                    <Label className="px-1 text-my-foreground-secondary">Ativo</Label>
                                    <div className="relative">
                                        
                                        { assetLogourl != null && <div className="absolute flex items-center bg-my-foreground/40 justify-center left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary rounded-sm">
                                            <span className="material-symbols-outlined text-lime-base !text-[22px]">finance_mode</span>
                                        </div> }
                                        { (!!assetLogourl) && <img src={assetLogourl} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary rounded-sm"/>}
                                        <Input ref={assetSymbolInputRef} type="text" placeholder="Nome do ativo" value={assetSymbol} onChange={(e) => setAssetSymbol(e.target.value)} onBlur={(e) => validateSymbol(e.target.value)} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 pl-[42px] text-my-foreground-secondary border-0 focus:!ring-[1px]" />
                                    </div>
                                </>
                            }
                            
                            {assetsForSale && operationType === "Venda" && <ComboboxAssetsForSale onBlur={()=> setAssetLogourl(assetsForSale[assetSymbol ||  ""])} assetsForSale={assetsForSale} assetForSale={assetSymbol} setAssetForSale={setAssetSymbol} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="px-1 text-my-foreground-secondary">Quantidade</Label>
                            <Input type="number" placeholder="0" min={0} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="px-1 text-my-foreground-secondary">Preço unitário</Label>
                            <Input type="text" placeholder="R$ 0,00" min={0} value={formatCentavosToReal(centavosUnitPrice)} onChange={handleChangeUnitPrice} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                    </div>

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="px-1 text-my-foreground-secondary">Taxas operacionais</Label>
                            <Input type="text" placeholder="0,00" min={0} step="0.01" value={formatCentavosToReal(centavosFees)} onChange={handleChangeFees} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="px-1 text-my-foreground-secondary">IRRF</Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm text-my-foreground bg-my-background cursor-no-drop">{formatCentavosToReal(centavosTaxes)}</span>
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
                        className="!bg-lime-base hover:!bg-lime-base hover:enabled:!brightness-110 border-none cursor-pointer text-my-background-secondary font-bold" 
                        variant="outline"
                    >
                        Cancelar
                    </Button>
                </DialogClose>
                <Button className="bg-my-background-secondary text-my-foreground-secondary cursor-pointer" form="form-new-order" type="submit">Salvar</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}