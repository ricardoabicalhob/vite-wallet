import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { formatCentavosToReal, formatPeriodoApuracaoToString, parseInputToCentavos } from "@/utils/formatters"
import type { DarfI, DarfToUpdateI } from "@/interfaces/darf.interface"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import { useUpdateDarf } from "@/queries/darf"
import { Link } from "react-router"
import Calendar24 from "./calendar-24"
import CalendarPagamento from "./calendar-pagamento"

interface DialogUpdateDarfProps {
    darf :DarfI
}

export function DialogUpdateDarf({
    darf,
} :DialogUpdateDarfProps) {

    const modalities = {
        "swing_trade": "Swing Trade",
        "day_trade": "Day Trade"
    }
    
    const [ isUpdateDialogOpen, setIsUpdateDialogOpen ] = useState(false)

    const [ modality, setModality ] = useState<TradeModality>()
    const [ periodoApuracao, setPeriodoApuracao ] = useState<number>()
    const [ codReceitaToUpdate, setCodReceitaToUpdate ] = useState<number>()
    const [ dueDateToUpdate, setDueDateToUpdate ] = useState<Date>()
    const [ centavosValorDoPrincipal, setCentavosValorDoPrincipal ] = useState<string>(darf.valorDoPrincipal.toString())
    const [ centavosValorDaMultaToUpdate, setCentavosValorDaMultaToUpdate ] = useState<string>("")
    const [ centavosValorJurosEncargosToUpdate, setCentavosValorJurosEncargosToUpdate ] = useState<string>("")
    const [ centavosValorTotal, setCentavosValorTotal ] = useState<string>(darf.valorTotal.toString())
    const [ paymentDateToUpdate, setPaymentDateToUpdate ] = useState<Date | null>(null)

    const { mutate: updateDarf } = useUpdateDarf()

    const handleChangeValorDoPrincipal = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosValorDoPrincipal(centavos)
    }

    const handleChangeValorDaMultaToUpdate = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)

        setCentavosValorDaMultaToUpdate(centavos)

        const total =
            parseInt(centavosValorDoPrincipal || "0") +
            parseInt(centavos || "0") +
            parseInt(centavosValorJurosEncargosToUpdate || "0")

        setCentavosValorTotal(total.toString())
    }

    const handleChangeValorJurosEncargosToUpdate = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)

        setCentavosValorJurosEncargosToUpdate(centavos)

        const total =
            parseInt(centavosValorDoPrincipal || "0") +
            parseInt(centavosValorDaMultaToUpdate || "0") +
            parseInt(centavos || "0")

        setCentavosValorTotal(total.toString())
    }

    const handleChangeValorTotal = (e :React.ChangeEvent<HTMLInputElement>) => {
        const centavos = parseInputToCentavos(e.target.value)
        setCentavosValorTotal(centavos)
    }



    function handleSubmitUpdate(e :React.FormEvent) {
        e.preventDefault()
        
        if(codReceitaToUpdate == null || dueDateToUpdate == null || centavosValorDaMultaToUpdate == null || centavosValorJurosEncargosToUpdate == null) {
            showErrorToast("Preencha todos os campos")
            return
        }

        const valorDaMultaInCents :number = parseFloat(parseInputToCentavos(centavosValorDaMultaToUpdate))
        const valorJurosEncargosInCents :number = parseInt(parseInputToCentavos(centavosValorJurosEncargosToUpdate))

        const darfToUpdate :DarfToUpdateI = {
            id: darf.id,
            codReceita: codReceitaToUpdate,
            dueDate: dueDateToUpdate,
            valorDaMulta: valorDaMultaInCents,
            valorJurosEncargos: valorJurosEncargosInCents,
            paymentDate: paymentDateToUpdate ?? null
        }

        updateDarf(darfToUpdate, {
            onError: (errorUpdateOrder) => {
                showErrorToast(errorUpdateOrder.message)
            },
            onSuccess: ()=> {
                setIsUpdateDialogOpen(false)
                showSuccesToast("DARF alterada com sucesso!")
            }
        })
    }

    return(
        <Dialog open={isUpdateDialogOpen} onOpenChange={(open)=> {
            setIsUpdateDialogOpen(open)

            if(open) {
                setModality(darf.modality)
                setPeriodoApuracao(darf.periodoApuracao)
                setCodReceitaToUpdate(darf.codReceita)
                setDueDateToUpdate(new Date(darf.dueDate))
                setCentavosValorDoPrincipal(parseInputToCentavos(darf.valorDoPrincipal.toString()))
                setCentavosValorDaMultaToUpdate(parseInputToCentavos(darf.valorDaMulta.toString()))
                setCentavosValorJurosEncargosToUpdate(parseInputToCentavos(darf.valorJurosEncargos.toString()))
                setCentavosValorTotal(parseInputToCentavos(darf.valorTotal.toString()))
                setPaymentDateToUpdate(darf.paymentDate ? new Date(darf.paymentDate) : null)
            }
        }}>
            <form id={`form-update-order-${darf.id}`} onSubmit={handleSubmitUpdate}>
                <DialogTrigger asChild>
                    <span
                        onClick={()=> setIsUpdateDialogOpen(true)}
                        className={`material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full ${darf.paga || darf.abaixoDoLimiteMinimo ? 'pointer-events-none text-my-foreground' : 'cursor-pointer'}`} style={{fontSize: 22}}                                                
                    >
                        edit_square
                    </span>
                </DialogTrigger>
                <DialogContent 
                    onEscapeKeyDown={(e) => e.preventDefault()} 
                    onPointerDownOutside={e => e.preventDefault()}
                    className="sm:max-w-[600px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary"
                >
                <DialogHeader>
                    <DialogTitle className="text-my-foreground-secondary">Editar DARF</DialogTitle>
                    <DialogDescription className="flex gap-3 items-center">
                        Faça alterações na sua DARF aqui. Clique em salvar quando terminar.
                        {/* <img 
                            src={logoUrl} 
                            alt="" 
                            className='rounded-sm w-10 h-10 justify-self-center bg-black 
                            shadow-[0_0_30px_5px_rgba(255,255,255,0.4)]
                            ring-0 ring-white/40
                            ring-offset-[1px] ring-offset-[#303028]
                            border border-white/20
                            backdrop-blur-sm' /> */}
                        
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* COLUNA ESQUERDA — Informações da DARF */}
                    <div className="flex flex-col gap-6">

                        <div className="flex flex-col gap-4 bg-my-background-secondary px-3 py-3 rounded-md">
                            <h3 className="text-lg font-semibold text-my-foreground-secondary">
                                Informações da DARF
                            </h3>

                            {/* Tipo */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label className="pl-1">Tipo</Label>
                                <span className="text-sm px-3 py-1.5 rounded-md bg-my-background select-none">
                                    {modality ? modalities[modality] : "-"}
                                </span>
                            </div>

                            {/* Competência */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label className="pl-1">Período de apuração</Label>
                                <span className="text-sm px-3 py-1.5 rounded-md bg-my-background select-none">
                                    {formatPeriodoApuracaoToString(periodoApuracao ?? 0)}
                                </span>
                            </div>

                            {/* Vencimento (ADICIONADO) */}
                            <div className="grid text-my-foreground-secondary">
                                <Label htmlFor={`vencimento-${darf.id}`} className="pl-1">Vencimento</Label>
                                <Calendar24 date={dueDateToUpdate} setDate={setDueDateToUpdate} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 bg-my-background-secondary px-3 py-3 rounded-md">
                            {/* Pagamento */}
                            <h3 className="text-lg font-semibold text-my-foreground-secondary">
                                {`Pagamento ${darf.paga ? '(Confirmado)' : '(Pendente)'}`}
                            </h3>

                            {/* Data pagamento */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label htmlFor={`pagamento-${darf.id}`} className="pl-1">Data de pagamento</Label>
                                <CalendarPagamento 
                                    date={paymentDateToUpdate} 
                                    setDate={setPaymentDateToUpdate} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA — Valores */}
                    <div className="flex flex-col gap-6">

                        <div className="flex flex-col gap-4 bg-my-background-secondary px-3 py-3 rounded-md h-full">
                            <h3 className="text-lg font-semibold text-my-foreground-secondary">
                                Valores
                            </h3>

                            {/* Valor do principal */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label htmlFor={`principal-${darf.id}`} className="pl-1">Valor do principal</Label>
                                <Input 
                                    id={`principal-${darf.id}`}
                                    name="principal"
                                    disabled
                                    placeholder="0,00"
                                    className="bg-my-background border-0 focus:!ring-[1px] ml-0.5"
                                    value={formatCentavosToReal(centavosValorDoPrincipal)}
                                    onChange={handleChangeValorDoPrincipal}
                                />
                            </div>

                            {/* Valor da multa */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor={`multa-${darf.id}`} className="pl-1">Valor da multa</Label>
                                    <Link 
                                        className="text-xs font-bold text-lime-base hover:brightness-125 transition mb-[-4px]"
                                        target="_blank"
                                        to="https://sicalc.receita.fazenda.gov.br/sicalc/principal"
                                    >
                                        Calcular Sicalc
                                    </Link>
                                </div>
                                <Input 
                                    id={`multa-${darf.id}`}
                                    name="multa"
                                    placeholder="0,00"
                                    className="bg-my-background border-0 focus:!ring-[1px] ml-0.5"
                                    value={formatCentavosToReal(centavosValorDaMultaToUpdate)}
                                    onChange={handleChangeValorDaMultaToUpdate}
                                />
                            </div>

                            {/* Juros */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label htmlFor={`juros-${darf.id}`} className="pl-1">Valor dos juros e/ou encargos</Label>
                                <Input 
                                    id={`juros-${darf.id}`}
                                    name="juros"
                                    placeholder="0,00"
                                    className="bg-my-background border-0 focus:!ring-[1px] ml-0.5"
                                    value={formatCentavosToReal(centavosValorJurosEncargosToUpdate)}
                                    onChange={handleChangeValorJurosEncargosToUpdate}
                                />
                            </div>

                            {/* Total */}
                            <div className="grid gap-2 text-my-foreground-secondary">
                                <Label htmlFor={`total-${darf.id}`} className="pl-1">Valor total</Label>
                                <Input 
                                    id={`total-${darf.id}`}
                                    name="total"
                                    disabled
                                    placeholder="0,00"
                                    className="bg-my-background border-0 focus:!ring-[1px] ml-0.5"
                                    value={formatCentavosToReal(centavosValorTotal)}
                                    onChange={handleChangeValorTotal}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={(e)=> {setIsUpdateDialogOpen(false); e.preventDefault()}} className="bg-lime-base hover:bg-lime-secondary border-none cursor-pointer text-white font-bold hover:text-white" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button className="bg-my-background-secondary text-my-foreground-secondary cursor-pointer" form={`form-update-order-${darf.id}`} type="submit">Salvar alterações</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}