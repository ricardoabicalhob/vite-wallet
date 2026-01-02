import { MoedaEmReal } from "./moeda-percentual";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { showErrorToast, showSuccesToast } from "@/utils/toasts";
import { formatPeriodoApuracaoToString } from "@/utils/formatters";
import type { CompensationResponse } from "@/interfaces/compensation.interface";
import { useDeleteCompensation } from "@/queries/compensation";
import { AlertDialogMessage } from "./alert-dialog";
import { AlertDialogTrigger } from "./ui/alert-dialog";

interface TableDarfsProps {
    compensations :CompensationResponse[]
}

export function TableCompensations({
    compensations
} :TableDarfsProps) {

    const modalities = {
        "swing_trade": "Swing Trade",
        "day_trade": "Day Trade"
    }

    const { mutate: deleteCompensation } = useDeleteCompensation()

    function handelDeleteDarf(id :string) {
        deleteCompensation(id, {
            onError: (errorDeleteDarf) => {
                showErrorToast(errorDeleteDarf.message)
            },
            onSuccess: ()=> {
                showSuccesToast(`DARF excluída!`)
            }
        })
    }

    return(
        <Table>
            <TableCaption>{`${compensations.length === 0 ? 'Lista de compensações vazia' : 'Lista de compensações'}`}</TableCaption>
            <TableHeader className="sticky top-0 bg-my-background z-10">
                <TableRow>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Período de apuração</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Modalidade</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[5%]">Código da Receita</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Valor total</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {compensations &&
                    compensations.map(compensation => (
                        <TableRow key={compensation.id}>
                            <TableCell className="text-my-foreground-secondary text-left tabular-nums">{formatPeriodoApuracaoToString(compensation.periodoApuracao)}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-left">{modalities[compensation.modality]}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums">{compensation.codReceita}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={compensation.valorTotal} /></TableCell>
                            
                            <TableCell>
                                
                                <div className="flex gap-1 items-center justify-end">

                                    <AlertDialogMessage
                                        title={
                                            <p className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lime-base !text-4xl">warning</span>
                                                <span>Você tem certeza?</span>
                                            </p>
                                        }
                                        message={
                                            <p>A compensação de <span className="text-my-foreground-secondary font-bold">{modalities[compensation.modality]}</span> registrada para o período de apuração <span className="text-my-foreground-secondary font-bold">{formatPeriodoApuracaoToString(compensation.periodoApuracao)}</span> será excluída definivamente. Deseja continuar?</p>
                                        }
                                        action={()=> {
                                            handelDeleteDarf(compensation.id)
                                        }}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <button 
                                                className={`material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full cursor-pointer`} 
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