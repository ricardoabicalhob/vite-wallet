import { TableCompensations } from "@/components/table-compensations"
import { Input } from "@/components/ui/input"
import { SystemContext } from "@/contexts/system.context"
import { UseCompensationByYear } from "@/queries/compensation"
import { filtrarListaDeCompensacoes } from "@/utils/filters.utils"
import { Search } from "lucide-react"
import { useContext, useState } from "react"

export default function Compensacoes() {

    const { selectedYear } = useContext(SystemContext)

    const [ inputFilter, setInputFilter ] = useState<string>("")

    const { data: compensations } = UseCompensationByYear(selectedYear)
    const compensationsListFiltered = filtrarListaDeCompensacoes(inputFilter.toUpperCase(), compensations ?? [])

    return(
        <div className="flex flex-1 w-full h-full text-my-foreground-secondary">
            <div className="flex flex-col flex-1 w-full min-h-[calc(100dvh-235px)] px-3 pb-3 text-my-foreground-secondary">

                <div className="relative w-full py-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary opacity-60" />
                    <Input 
                        className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border border-[#29292E] focus:!ring-[1px] ml-0.5 pl-10 pr-4"
                        placeholder="Buscar por modalidade, período de apuração..."
                        value={inputFilter}
                        onChange={(e) => {setInputFilter(e.target.value)}}
                    />
                </div>

                <div className="flex gap-3 h-full">
                    <div className="flex grow w-[50%] overflow-y-auto overflow-x-hidden border-[#29292E] border rounded-md p-2 custom-scrollbar-div">   

                        <TableCompensations
                            compensations={compensationsListFiltered ?? []}
                        />

                    </div>
                </div>

            </div>
            
        </div>
    )
}