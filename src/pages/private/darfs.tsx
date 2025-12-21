import { TableDarfs } from "@/components/table-darfs";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth.context";
import { getDarfs } from "@/queries/darf";
import { filtarListaDeDarfs } from "@/utils/filters.utils";
import { showErrorToast } from "@/utils/toasts";
import { Search } from "lucide-react";
import { useContext, useState } from "react";

export default function DarfsPage() {

    const { loginResponse } = useContext(AuthContext)
    const [ inputFilter, setInputFilter ] = useState<string>("")
    const userId = loginResponse?.objetoResposta.id || ""

    const { data: darfs, isError: isErrorDarfs, error: errorDarfs } = getDarfs(userId)

    const darfListFiltered = filtarListaDeDarfs(inputFilter.toUpperCase(), darfs ?? [])

    if(isErrorDarfs) {
        if(errorDarfs && errorDarfs.message) {
            showErrorToast(errorDarfs.message ?? "Falha ao carregar as informações.")
        }
    }

    return(
        <div className="flex flex-1 w-full h-full text-my-foreground-secondary p-3">
            <div className="flex flex-col gap-3 flex-1 w-full min-h-[calc(100dvh-235px)] text-my-foreground-secondary">

                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-my-foreground-secondary opacity-60" />
                    <Input 
                        className="bg-my-background-secondary selection:bg-blue-500 text-my-foreground-secondary border border-[#29292E] focus:!ring-[1px] ml-0.5 pl-10 pr-4"
                        placeholder="Buscar por modalidade, período de apuração, situação, vencimento, pagamento..."
                        value={inputFilter}
                        onChange={(e) => {setInputFilter(e.target.value)}}
                    />
                </div>

                <div className="flex grow w-full overflow-y-auto overflow-x-hidden border-[#29292E] border rounded-md p-2 custom-scrollbar-div">   

                    <TableDarfs
                        darfs={darfListFiltered ?? []}
                    />
                </div>

            </div>
            
        </div>
    )
}