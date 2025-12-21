import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import type { RecommendedAssetUpdatePlannedPercentage } from "@/interfaces/recommendedAsset.interface"
import { useUpdateRecommendedAssetPlannedPercentage } from "@/queries/recommendedAsset"
import { showErrorToast, showSuccesToast } from "@/utils/toasts"
import type { AtivoPlanejadoConsolidado } from "@/interfaces/ativoPlanejadoConsolidado.interface"

interface DialogUpdateRecommendedAssetProps {
    ativoPlanejado :AtivoPlanejadoConsolidado
}

export function DialogUpdateRecommendedAsset({ 
    ativoPlanejado,
} :DialogUpdateRecommendedAssetProps) {

    const [ isUpdateDialogOpen, setIsUpdateDialogOpen ] = useState(false)

    const [ idRecommendedAsset, setIdRecommendedAsset ] = useState<string>("")
    const [ plannedPercentageToUpdate, setPlannedPercentageToUpdate ] = useState<number>(0)

    const { mutate: updateRecommendedAssetPlannedPercentage } = useUpdateRecommendedAssetPlannedPercentage()

    function handleSubmitUpdate(e :React.FormEvent) {
        e.preventDefault()

        if(
            idRecommendedAsset === null
        ) {
            throw new Error("Preencha todos os campos")
        }

        const recommendedAssetToUpdate :RecommendedAssetUpdatePlannedPercentage = {
            id: idRecommendedAsset,
            plannedPercentage: plannedPercentageToUpdate * 1000
        }

        updateRecommendedAssetPlannedPercentage(recommendedAssetToUpdate, {
            onError: (errorUpdateRecommendedAssetPlannedPercentage) => {
                showErrorToast(errorUpdateRecommendedAssetPlannedPercentage.message)
            },
            onSuccess: ()=> {
                setIsUpdateDialogOpen(false)
                showSuccesToast("Percentual planejado alterado com sucesso!")
            }
        })

    }

    return(
        <Dialog open={isUpdateDialogOpen} key={`dialog-update-${ativoPlanejado.symbol}`} onOpenChange={()=> {
            setIdRecommendedAsset(
                ativoPlanejado.id || ""
            )
            setPlannedPercentageToUpdate(parseFloat(ativoPlanejado.percentualPlanjado) || 0)
        }}>
            <form id={`form-update-recommended-asset-${ativoPlanejado.symbol}`} onSubmit={handleSubmitUpdate}>
                <DialogTrigger asChild>
                    <span
                        onClick={()=> {
                            setIsUpdateDialogOpen(true); 
                        }}
                        className="material-symbols-outlined text-lime-secondary opacity-60 hover:bg-my-foreground/50 p-1 rounded-full cursor-pointer" style={{fontSize: 22}}                                                
                    >
                        edit_square
                    </span>
                </DialogTrigger>
                <DialogContent 
                    onEscapeKeyDown={e => e.preventDefault()} 
                    onPointerDownOutside={e => e.preventDefault()}
                    className="sm:max-w-[425px] bg-my-background border-2 border-my-foreground/40 shadow-xl shadow-my-background-secondary"
                >
                <DialogHeader>
                    <DialogTitle className="text-my-foreground-secondary">Editar o percentual planejado</DialogTitle>
                    <DialogDescription className="flex gap3 items-center">
                        Faça alterações no percentual planejado para este ativo aqui. Clique em salvar quando terminar.
                        <img 
                            src={ ativoPlanejado.logoUrl } 
                            alt="" 
                            className='rounded-sm w-10 h-10 justify-self-center bg-black 
                            shadow-[0_0_30px_5px_rgba(255,255,255,0.4)]
                            ring-0 ring-white/40
                            ring-offset-[2px] ring-offset-[#303028]
                            border border-white/20
                            backdrop-blur-sm' />
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3 text-my-foreground-secondary">
                        <Label htmlFor={`span-asset-${ativoPlanejado.shortName}`}>Código do ativo</Label>
                        <span className="px-2.5 py-2 rounded-md select-none text-sm bg-my-background-secondary cursor-no-drop" id={`span-asset-${ativoPlanejado.shortName}`} >{ ativoPlanejado.symbol }</span>
                    </div>
                    <div className="grid gap-3 text-my-foreground-secondary">
                        <Label htmlFor="planned-percentage-1">Percentual planejado (%)</Label>
                        <Input placeholder="0" step={"0.01"} type="number" className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border-0 focus:!ring-[1px] ml-0.5 hide-webkit-spinners" value={plannedPercentageToUpdate} onChange={(e)=> setPlannedPercentageToUpdate(parseFloat(e.target.value))} id="planned-percentage-1" name="planned-percentage" defaultValue={plannedPercentageToUpdate} />
                    </div>     
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button 
                            onClick={(e)=> {setIsUpdateDialogOpen(false); e.preventDefault()}}
                            className="bg-lime-base hover:bg-lime-secondary border-none cursor-pointer text-white font-bold hover:text-white" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button 
                        className="bg-my-background-secondary text-my-foreground-secondary cursor-pointer" 
                        form={`form-update-recommended-asset-${ativoPlanejado.symbol}`} 
                        type="submit"
                        onClick={(e)=> handleSubmitUpdate(e)}    
                    >Salvar alterações</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}