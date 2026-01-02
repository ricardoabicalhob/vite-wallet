import type { TradeModality } from "@/interfaces/orderBreakdown.interface";
import { createContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface SystemProviderProps {
    children :ReactNode
}

interface SystemContextProps {
    tradeModality :TradeModality
    setTradeModality :Dispatch<SetStateAction<TradeModality>>,
    selectedDate :Date | undefined,
    setSelectedDate :Dispatch<SetStateAction<Date | undefined>>
    selectedYear :number,
    setSelectedYear :Dispatch<SetStateAction<number>>
}

export const SystemContext = createContext({} as SystemContextProps)

export function SystemProvider({ children } :SystemProviderProps) {

    const [ tradeModality, setTradeModality ] = useState<TradeModality>("swing_trade")
    const [ selectedDate, setSelectedDate ] = useState<Date | undefined>(new Date())
    const [ selectedYear, setSelectedYear ] = useState<number>(0)

    const contextValue = useMemo(()=> ({
        tradeModality, setTradeModality,
        selectedDate, setSelectedDate,
        selectedYear, setSelectedYear
    }), [
        tradeModality, 
        setTradeModality,
        selectedDate,
        setSelectedDate,
        selectedYear,
        setSelectedYear
    ]) 

    return(
        <SystemContext.Provider value={contextValue}>
            { children }
        </SystemContext.Provider>
    )
}