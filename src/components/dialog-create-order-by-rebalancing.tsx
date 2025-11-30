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
import type { AssetType, OperationType, OrderCreate } from "@/interfaces/order.interface"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { useCreateOrder } from "@/queries/orders"
import { useFocusOnOpen } from "@/hooks/useFocusOnOpen"
import { formatCentavosToReal, parseInputToCentavos } from "@/utils/formatters"

interface DialogCreateOrderByRebalancingProps {
    userId :string
    initialOperationType :"Compra" | "Venda"
    initialAssetSymbol :string
    assetLogourl :string
}

export function DialogCreateOrderByRebalancing({
    userId,
    initialOperationType: initialOperationType,
    initialAssetSymbol,
    assetLogourl,
} :DialogCreateOrderByRebalancingProps) {

    const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false)

    const [ date, setDate ] = useState<Date | undefined>(new Date())
    const [ assetSymbol, setAssetSymbol ] = useState<string>(initialAssetSymbol)
    const [ amount, setAmount ] = useState<number>()
    const [ centavosUnitPrice, setCentavosUnitPrice ] = useState<string>("")
    const [ centavosFees, setCentavosFees ] = useState<string>("")
    const [ centavosTaxes, setCentavosTaxes ] = useState<string>("")
    const [ operationType, setOperationType ] = useState<"Compra" | "Venda">(initialOperationType)
    const [ assetType, setAssetType ] = useState<"Acao" | "Fii" | "Cripto">("Acao")

    const { mutate: createOrder } = useCreateOrder()

    const quantidadeInputRef = useRef<HTMLInputElement>(null)


    const handleChangeUnitPrice = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosUnitPrice(centavos)
    }

    const handleChangeFees = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosFees(centavos)
    }


    function resetForm() {
        setDate(new Date())
        setAssetSymbol("")
        setAmount(0)
        setCentavosUnitPrice("0.00")
        setCentavosFees("0.00")
        setCentavosTaxes("0.00")
        setOperationType("Compra")
        setAssetType("Acao")
    }

    function handleSubmit(e :React.FormEvent) {
        e.preventDefault()
        if(!date || !assetType || !amount || !operationType || !userId) {
            throw new Error("Preencha todos os campos!")
        }

        let averagePrice :number | null = null
        let irrfToSave :number = 0

        // const feesInCents :number = Math.round(parseFloat(centavosFees || "0") * 100)
        // const unitPriceInCents :number = parseFloat(centavosUnitPrice || "0") * 100
        const unitPriceInCents :number = parseInt(parseInputToCentavos(centavosUnitPrice))
        const feesInCents :number = parseInt(parseInputToCentavos(centavosFees))

        // if(operationType === "Venda") {
        //     averagePrice = obterPrecoMedioBrutoPagoNoAtivoEmCentavos(ordens || [], userId, removeTrailingF(assetSymbol))
        //     irrfToSave = calcularIRRFsobreOrdemDeVendaEmCentavos(amount || 0, parseFloat(unitPrice || "0"))
        //     setTaxes(converterValorDeCentavosParaReais(irrfToSave).toString())
        // }

        const orderToCreate :OrderCreate = {
            orderDate: date,
            assetType: assetType.toLowerCase() as AssetType,
            symbol: initialAssetSymbol,
            amount: amount,
            unitPrice: unitPriceInCents,
            fees: feesInCents,
            taxes: irrfToSave || 0,
            operationType: operationType.toLowerCase() as OperationType,
            userId: userId,
            averagePrice: averagePrice
        }
        createOrder(orderToCreate, {
            onError: (errorCreateOrder) => {
                showErrorToast(errorCreateOrder.message)
            },
            onSuccess: (orderCreated)=> {
                showSuccesToast(`${orderCreated?.symbol} - Ordem criada!`)
                setIsCreateDialogOpen(false)
                resetForm()
            }
        })
    }

    useFocusOnOpen(quantidadeInputRef, isCreateDialogOpen)

    return(
        <Dialog open={isCreateDialogOpen}>
            <DialogTrigger asChild>
                <DisplayIcon
                    className="!text-[22px] text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full cursor-pointer"
                    onClick={() => setIsCreateDialogOpen(true)}
                >contextual_token_add</DisplayIcon>
            </DialogTrigger>
            <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} className="sm:max-w-[600px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary">
            <DialogHeader>
                <DialogTitle className="text-my-foreground-secondary">Nova ordem de negociação</DialogTitle>
                <div className="flex items-center justify-between gap-2">
                    <DialogDescription>
                        Preencha as informações para a nova ordem de negociação. Clique em salvar quando terminar.
                    </DialogDescription>
                    {/* { assetLogourl && <img src={assetLogourl} alt="" className='rounded-sm w-10 h-10 justify-self-center' /> } */}
                </div>
            </DialogHeader>
            <div className="gap-4">
                <form id="form-new-order" onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <Calendar24 date={date} setDate={setDate} />
                        <ComboboxOperationType operationType={operationType} setOperationType={setOperationType} />
                        <ComboboxAssetType assetType={assetType} setAssetType={setAssetType} />
                    </div>

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label className="px-1 text-my-foreground-secondary">Ativo</Label>
                            <div className="relative">
                                { !!!assetLogourl && <div className="absolute flex items-center bg-my-foreground/40 justify-center left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary rounded-sm">
                                    <span className="material-symbols-outlined text-lime-base !text-[22px]">finance_mode</span>
                                </div> }
                                { !!assetLogourl && <img src={assetLogourl} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary rounded-sm"/>}
                                <span className="px-[42px] py-2 rounded-md select-none text-sm text-my-foreground bg-my-background cursor-no-drop">{initialAssetSymbol}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="px-1 text-my-foreground-secondary">Quantidade</Label>
                            <Input ref={quantidadeInputRef} type="number" placeholder="0" min={0} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="px-1 text-my-foreground-secondary">Preço unitário</Label>
                            <Input type="text" placeholder="0,00" min={0} value={formatCentavosToReal(centavosUnitPrice)} onChange={handleChangeUnitPrice} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                    </div>

                    <div className="bg-my-background-secondary p-4 rounded-lg grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label className="px-1 text-my-foreground-secondary">Taxas</Label>
                            <Input type="text" placeholder="0,00" min={0} value={formatCentavosToReal(centavosFees)} onChange={handleChangeFees} onFocus={e => e.target.select()} className="bg-my-background selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] hide-webkit-spinners" />
                        </div>
                        <div className="flex flex-col gap-3">
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
                            setAssetSymbol("")
                        }} 
                        className="bg-lime-base hover:bg-lime-secondary border-none cursor-pointer text-white font-bold hover:text-white" 
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