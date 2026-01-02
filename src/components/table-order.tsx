import type { OrderPresenter } from "@/interfaces/order.interface"
import { MoedaEmReal } from "./moeda-percentual"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import { useDeleteOrder } from "@/queries/order"
import { DialogInfoOrder } from "./dialog-info-order"
import { DialogUpdateOrder } from "./dialog-update-order"
import { TypeOperationIndicator } from "./type-operation_indicator"
import { AlertDialogMessage } from "./alert-dialog"
import { AlertDialogTrigger } from "./ui/alert-dialog"
import { AssetLogo } from "./asset-logo"

interface TableOrdersProps {
    orderListFiltered :OrderPresenter[]
    logoUrlPorAtivos :Record<string, string>
}

export function TableOrders({
    orderListFiltered,
    logoUrlPorAtivos
} :TableOrdersProps) {

    const { mutate: deleteOrder } = useDeleteOrder()

    function handelDeleteOrder(ordem :OrderPresenter) {
        const id = ordem.id
        
        deleteOrder(id, {
            onError: (errorDeleteOrder) => {
                showErrorToast(errorDeleteOrder.message)
            },
            onSuccess: ()=> {
                showSuccesToast(`Ordem excluída!`)
            }
        })
    }

    return(
        <Table>
            <TableCaption>{`${orderListFiltered.length === 0 ? 'Lista de ordens vazia' : 'Lista de ordens'}`}</TableCaption>
            <TableHeader className="sticky top-0 bg-my-background z-10">
                <TableRow>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Data</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Tipo</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ativo</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Código</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Quantidade</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Preço unit.</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Taxas</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">IRRF</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Total sem taxas</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Total com taxas</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Preço com taxas</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Operação</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderListFiltered && orderListFiltered.map(ordem => (
                    <TableRow key={ordem.id}>
                        <TableCell className="text-my-foreground-secondary tabular-nums">{new Date(ordem.orderDate).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-my-foreground-secondary">{ordem.assetType}</TableCell>
                        <TableCell className="text-my-foreground-secondary">
                            <AssetLogo src={logoUrlPorAtivos[ordem.symbol]} className="rounded-sm w-5 h-5"/>
                        </TableCell>
                        <TableCell className="text-my-foreground-secondary text-center tabular-nums">{ordem.symbol}</TableCell>
                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">{ordem.amount}</TableCell>
                        
                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={ordem.unitPrice}/>
                        </TableCell>
                        
                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={ordem.fees || 0}/>
                        </TableCell>
                        
                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={ordem.taxes || 0}/>
                        </TableCell>

                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={ordem.grossValue}/>
                        </TableCell>

                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={ordem.netValue}/>
                        </TableCell>

                        <TableCell className="text-my-foreground-secondary text-right tabular-nums">
                            <MoedaEmReal centavos={((((ordem.fees || 0) + (ordem.taxes || 0)) / ordem.amount) + ordem.unitPrice)}/>
                        </TableCell>

                        <TableCell className="text-my-foreground-secondary">
                            <TypeOperationIndicator  
                                className="justify-self-center"
                                typeOperation={ ordem.operationType }
                            />
                        </TableCell>

                        <TableCell className="text-my-foreground-secondary">
                            <div className="flex gap-1 items-center justify-center">
                                
                                <DialogInfoOrder
                                    ordem={ordem}
                                    logoUrl={logoUrlPorAtivos[ordem.symbol]}
                                />

                                <DialogUpdateOrder
                                    ordem={ordem}
                                    logoUrl={logoUrlPorAtivos[ordem.symbol]}
                                />

                                <AlertDialogMessage
                                    title={
                                        <p className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lime-base !text-4xl">warning</span>
                                            <span>Você tem certeza?</span>
                                        </p>
                                    }
                                    message={
                                        <p>A ordem de <span className="text-my-foreground-secondary font-bold">{ordem.operationType}</span> registrada para <span className="text-my-foreground-secondary font-bold">{ordem.symbol}</span> será excluída definivamente. Deseja continuar?</p>
                                    }
                                    action={()=> {
                                        handelDeleteOrder(ordem)
                                    }}
                                >
                                    <AlertDialogTrigger asChild>
                                        <button 
                                            className="material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full cursor-pointer" 
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