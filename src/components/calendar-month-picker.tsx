import { Label } from "@/components/ui/label"
import { type Dispatch, type SetStateAction, useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Props do componente (mantida)
interface MonthPickerProps {
    date: Date | undefined // Data completa
    setDate: Dispatch<SetStateAction<Date | undefined>> // Função para atualizar
    startYear?: number // Ano inicial (default: 2015)
}

// 💡 CORREÇÃO 1: Array de meses com value de 0 a 11
const MONTHS = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
]

export default function MonthPicker({
    date,
    setDate,
}: MonthPickerProps) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    // 💡 CORREÇÃO 2: Mês atual é usado diretamente (0-indexado)
    const currentMonthIndex = currentDate.getMonth() 

    // 💡 DERIVAÇÃO: Use a prop 'date' diretamente. Removemos o useState.
    // Se 'date' for undefined, usa o valor atual. Convertemos para String para o Select.
    const selectedMonthStr = date?.getMonth() !== undefined 
        ? String(date.getMonth()) 
        : String(currentMonthIndex)
    const selectedYearStr = date?.getFullYear() 
        ? String(date.getFullYear()) 
        : String(currentYear)

    // 💡 FUNÇÃO CENTRAL: Atualiza Mês/Ano e propaga a mudança IMEDIATAMENTE
    const updateDate = useCallback((newMonthStr: string, newYearStr: string) => {
        const newMonthIndex = Number(newMonthStr) // Já é 0-11
        const newYear = Number(newYearStr)
        
        if (!isNaN(newMonthIndex) && newYear) {
            // Cria um novo objeto Date com o dia 1 para evitar problemas de overflow (ex: Fevereiro 31)
            // O mês (newMonthIndex) já está correto (0-11)
            const newDate = new Date(newYear, newMonthIndex, 1); 
            
            // Chama setDate no componente pai, forçando a re-renderização imediata
            setDate(newDate)
        }
    }, [setDate])

    const handleMonthChange = (newMonthStr: string) => {
        updateDate(newMonthStr, selectedYearStr)
    }

    // Renderização dos Dropdowns
    return (
        <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="select-month" className="text-sm pl-2">Mês</Label>
                <Select
                    value={selectedMonthStr} // 💡 Usa a prop derivada
                    onValueChange={handleMonthChange} // 💡 Usa o manipulador imediato
                >
                    <SelectTrigger id="select-month" className="w-full justify-between focus:!ring-[1px] ml-0.5 font-normal text-my-foreground-secondary bg-my-background-secondary border-0 hover:bg-my-background-secondary hover:text-my-foreground-secondary cursor-pointer">
                        <SelectValue placeholder="Selecione o Mês" />
                    </SelectTrigger>
                    <SelectContent>
                        {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={String(month.value)}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}