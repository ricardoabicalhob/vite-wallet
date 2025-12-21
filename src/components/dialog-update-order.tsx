import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import type { OrderPresenter, OrderToUpdate } from "@/interfaces/order.interface"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { calcularIRRFsobreOrdemDeVendaEmCentavos } from "@/utils/taxes.utils"
import { converterValorDeCentavosParaReais } from "@/utils/assets.utils"
import { useUpdateOrder } from "@/queries/order"
import { formatCentavosToReal, parseInputToCentavos } from "@/utils/formatters"

interface DialogUpdateOrderProps {
    ordem :OrderPresenter
    logoUrl :string
}

export function DialogUpdateOrder({
    ordem,
    logoUrl
} :DialogUpdateOrderProps) {

    const [ isUpdateDialogOpen, setIsUpdateDialogOpen ] = useState(false)

    const [ assetSymbol, setAssetSymbol ] = useState<string>()
    const [ amountToUpdate, setAmountToUpdate ] = useState<number>()
    const [ centavosUnitPriceToUpdate, setCentavosUnitPriceToUpdate ] = useState<string>("")
    const [ centavosFeesToUpdate, setCentavosFeesToUpdate ] = useState<string>("")
    const [ centavosTaxesToUpdate, setCentavosTaxesToUpdate ] = useState<string>("")
    const [ orderDate, setOrderDate ] = useState<Date | undefined>()
    const [ operationTypeToUpdate, setOperationTypeToUpdate ] = useState<"compra" | "venda">("compra")
    const [ orderIdToUpdate, setOrderIdToUpdate ] = useState<string>("")

    const { mutate: updateOrder } = useUpdateOrder()


    const handleChangeUnitPriceToUpdate = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosUnitPriceToUpdate(centavos)
    }

    const handleChangeFeesToUpdate = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosFeesToUpdate(centavos)
    }



    function handleSubmitUpdate(e :React.FormEvent) {
        e.preventDefault()
        
        if(!amountToUpdate || !centavosUnitPriceToUpdate || !centavosFeesToUpdate || !centavosTaxesToUpdate || !orderIdToUpdate) {
            showErrorToast("Preencha todos os campos")
            return
        }

        let irrfToSaveToUpdate :number = 0

        const feesInCents :number = parseFloat(centavosFeesToUpdate || "0") * 100
        const unitPriceInCents :number = parseInt(parseInputToCentavos(centavosUnitPriceToUpdate))

        if(operationTypeToUpdate === "venda") {
            irrfToSaveToUpdate = calcularIRRFsobreOrdemDeVendaEmCentavos(amountToUpdate || 0, parseFloat(centavosUnitPriceToUpdate || "0"))
            setCentavosTaxesToUpdate(converterValorDeCentavosParaReais(irrfToSaveToUpdate).toString())
        }

        const orderToUpdate :OrderToUpdate = {
            amount: amountToUpdate || 0,
            unitPrice: unitPriceInCents,
            fees: feesInCents,
            taxes: irrfToSaveToUpdate || 0,
            id: orderIdToUpdate
        }

        updateOrder(orderToUpdate, {
            onError: (errorUpdateOrder) => {
                showErrorToast(errorUpdateOrder.message)
            },
            onSuccess: ()=> {
                setIsUpdateDialogOpen(false)
                showSuccesToast("Ordem alterada com sucesso!")
            }
        })
    }

    return(
        <Dialog open={isUpdateDialogOpen} onOpenChange={(open)=> {
            setIsUpdateDialogOpen(open)

            if(open) {
                setAssetSymbol(ordem.symbol)
                setOrderDate(ordem.orderDate)
                setAmountToUpdate(ordem.amount)
                setCentavosUnitPriceToUpdate(parseInputToCentavos(ordem.unitPrice.toString()))
                setCentavosFeesToUpdate(parseInputToCentavos(ordem.fees.toString()))
                setCentavosTaxesToUpdate(parseInputToCentavos(ordem.taxes.toString()))
                // setUnitPriceToUpdate(((ordem.unitPrice || 0) / 100).toString())
                // setCentavosFeesToUpdate(((ordem.fees || 0) / 100).toString())
                // setCentavosTaxesToUpdate(((ordem.taxes || 0) / 100).toString())
                setOrderIdToUpdate(ordem.id)    
                setOperationTypeToUpdate(ordem.operationType)
            }
        }}>
            <form id={`form-update-order-${ordem.id}`} onSubmit={handleSubmitUpdate}>
                <DialogTrigger asChild>
                    <span
                        onClick={()=> setIsUpdateDialogOpen(true)}
                        className={`material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full ${ordem.status === "arquivada" ? 'pointer-events-none text-my-foreground' : 'cursor-pointer'}`} style={{fontSize: 22}}                                                
                    >
                        edit_square
                    </span>
                </DialogTrigger>
                <DialogContent 
                    onEscapeKeyDown={(e) => e.preventDefault()} 
                    onPointerDownOutside={e => e.preventDefault()}
                    className="sm:max-w-[425px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary"
                >
                <DialogHeader>
                    <DialogTitle className="text-my-foreground-secondary">Editar ordem</DialogTitle>
                    <DialogDescription className="flex gap-3 items-center">
                        Faça alterações na sua ordem aqui. Clique em salvar quando terminar.
                        <img 
                            src={logoUrl} 
                            alt="" 
                            className='rounded-sm w-10 h-10 justify-self-center bg-black 
                            shadow-[0_0_30px_5px_rgba(255,255,255,0.4)]
                            ring-0 ring-white/40
                            ring-offset-[1px] ring-offset-[#303028]
                            border border-white/20
                            backdrop-blur-sm' />
                        
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm text-my-foreground-secondary bg-my-background-secondary cursor-no-drop">
                        { assetSymbol }
                    </span>
                    <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm text-my-foreground-secondary bg-my-background-secondary cursor-no-drop">
                        { new Date(orderDate || "").toLocaleDateString('pt-BR') }
                    </span>
                    <div className="grid gap-3 text-my-foreground-secondary">
                        <Label htmlFor={`amount-${ordem.id}`} className="pl-1">Quantidade</Label>
                        <Input placeholder="0" className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5" value={amountToUpdate} onChange={(e)=> setAmountToUpdate(e.target.value === '' ? undefined : parseInt(e.target.value))} id={`amount-${ordem.id}`} name="amount" defaultValue={ordem.amount} />
                    </div>
                    <div className="grid gap-3 text-my-foreground-secondary">
                        <Label htmlFor={`unitprice-${ordem.id}`} className="pl-1">Preço unitário</Label>
                        <Input placeholder="0,00" className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5 hide-webkit-spinners" type="text" value={formatCentavosToReal(centavosUnitPriceToUpdate)} onChange={handleChangeUnitPriceToUpdate} id={`unitprice-${ordem.id}`} name="unitprice" />
                    </div>
                    <div className="grid gap-3 text-my-foreground-secondary">
                        <Label htmlFor={`fees-${ordem.id}`} className="pl-1">Taxas operacionais</Label>
                        <Input placeholder="0,00" className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5 hide-webkit-spinners" type="text" value={formatCentavosToReal(centavosFeesToUpdate)} onChange={handleChangeFeesToUpdate} id={`fees-${ordem.id}`} name="fees" />
                    </div>
                    {
                        operationTypeToUpdate === "venda" &&
                        <div className="grid gap-3 text-my-foreground-secondary">
                            <Label htmlFor="taxes-1" className="pl-1">Imposto de Renda Retido na Fonte (IRRF)</Label>
                            <span className="ml-1 px-2.5 py-2 rounded-md select-none text-sm text-my-foreground-secondary bg-my-background-secondary cursor-no-drop">{formatCentavosToReal(centavosTaxesToUpdate)}</span>
                        </div>
                    }
                    <Separator className="bg-my-background-secondary" />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={(e)=> {setIsUpdateDialogOpen(false); e.preventDefault()}} className="bg-lime-base hover:bg-lime-secondary border-none cursor-pointer text-white font-bold hover:text-white" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button className="bg-my-background-secondary text-my-foreground-secondary cursor-pointer" form={`form-update-order-${ordem.id}`} type="submit">Salvar alterações</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}