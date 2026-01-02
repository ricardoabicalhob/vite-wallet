import type { DarfI } from "@/interfaces/darf.interface";
import { MoedaEmReal } from "./moeda-percentual";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DialogUpdateDarf } from "./dialog-update-darf";
import { AlertDialogMessage } from "./alert-dialog";
import { useCancelPagamentoDarf, useDeleteDarf } from "@/queries/darf";
import { showErrorToast, showSuccesToast } from "@/utils/toasts";
import { AlertDialogTrigger } from "./ui/alert-dialog";
import { DialogDarf } from "./dialog-darf";
import { formatPeriodoApuracaoToString } from "@/utils/formatters";

interface TableDarfsProps {
    darfs :DarfI[]
}

export function TableDarfs({
    darfs
} :TableDarfsProps) {

    const modalities = {
        "swing_trade": "Swing Trade",
        "day_trade": "Day Trade"
    }

    const { mutate: deleteDarf } = useDeleteDarf()
    const { mutate: cancelarPagamentoDarf } = useCancelPagamentoDarf()

    function handelDeleteDarf(id :string) {
        deleteDarf(id, {
            onError: (errorDeleteDarf) => {
                showErrorToast(errorDeleteDarf.message)
            },
            onSuccess: ()=> {
                showSuccesToast(`DARF excluída!`)
            }
        })
    }

    function handlePagamentoDarf(id :string) {
        cancelarPagamentoDarf(id, {
            onError: (errorUpdatedDarf) => {
                showErrorToast(errorUpdatedDarf.message)
            },
            onSuccess: (darfUpdated)=> {
                showSuccesToast(`${darfUpdated?.paga ? 'Registro de pagamento feito.' : 'Registro de pagamento desfeito.'}`)
            }
        })
    }

    return(
        <Table>
            <TableCaption>{`${darfs.length === 0 ? 'Lista de DARFs vazia' : 'Lista de DARFs'}`}</TableCaption>
            <TableHeader className="sticky top-0 bg-my-background z-10">
                <TableRow>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Período de apuração</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Modalidade</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[5%]">Código da Receita</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Vencimento</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Valor do principal</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Multa</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Juros / Encargos</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Valor total</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[8%]">Situação</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[10%]">Pagamento</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {darfs &&
                    darfs.map(darf => (
                        <TableRow key={darf.id}>
                            <TableCell className="text-my-foreground-secondary text-left tabular-nums">{formatPeriodoApuracaoToString(darf.periodoApuracao)}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-left">{modalities[darf.modality]}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums">{darf.codReceita}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums">{new Date(darf.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={darf.valorDoPrincipal} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={darf.valorDaMulta} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={darf.valorJurosEncargos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={darf.valorTotal} /></TableCell>
                            {
                                darf.paga
                                ?
                                <TableCell className="text-my-foreground-secondary text-right tabular-nums"><span>Paga</span></TableCell>
                                :
                                (
                                    darf.abaixoDoLimiteMinimo
                                    ?
                                    <TableCell className="text-my-foreground-secondary text-right tabular-nums">{ darf.abaixoDoLimiteMinimo && <span>Vedado</span> }</TableCell>
                                    :
                                    <TableCell className="text-my-foreground-secondary text-right tabular-nums"><span>Pendente</span></TableCell>
                                )
                            }
                            
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums">{ darf.paymentDate ? new Date(darf.paymentDate).toLocaleDateString('pt-BR') : '-' }</TableCell>

                            <TableCell>
                                
                                <div className="flex gap-1 items-center justify-end">

                                    <div className="flex">
                                        {darf.paymentDate && !darf.abaixoDoLimiteMinimo &&
                                            <button 
                                                className="material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full cursor-pointer"
                                                style={{fontSize: 18}}
                                                onClick={()=> handlePagamentoDarf(darf.id)}    
                                            >currency_exchange</button>
                                        }
                                        {!darf.paymentDate && !darf.abaixoDoLimiteMinimo &&
                                            <span
                                                className="material-symbols-outlined text-my-foreground opacity-60 p-1 rounded-full select-none"
                                                style={{fontSize: 22}}
                                            >paid</span>
                                        }
                                    </div>

                                    <DialogDarf
                                        darf={darf}
                                    />

                                    <DialogUpdateDarf 
                                        darf={darf}
                                    />

                                    <AlertDialogMessage
                                        title={
                                            <p className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lime-base !text-4xl">warning</span>
                                                <span>Você tem certeza?</span>
                                            </p>
                                        }
                                        message={
                                            <p>A DARF de <span className="text-my-foreground-secondary font-bold">{modalities[darf.modality]}</span> registrada para o período de apuração <span className="text-my-foreground-secondary font-bold">{formatPeriodoApuracaoToString(darf.periodoApuracao)}</span> será excluída definivamente. Deseja continuar?</p>
                                        }
                                        action={()=> {
                                            handelDeleteDarf(darf.id)
                                        }}
                                    >
                                        <AlertDialogTrigger disabled={darf.paga} asChild>
                                            <button 
                                                className={`material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full ${darf.paga || (darf.accumulationDarfId && darf.accumulationDarfId !== darf.id) ? 'pointer-events-none text-my-foreground' : 'cursor-pointer'}`} 
                                                style={{fontSize: 22}}
                                            >
                                                delete
                                            </button>
                                        </AlertDialogTrigger>
                                    </AlertDialogMessage>
                                </div>
                                
                            </TableCell>
                        </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}