import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import api from "./api"
import { AxiosError } from "axios"

const processFiscalResultService = { 

    execute: async (year :number, month :number, modality :TradeModality) => {
        if(!year || !month || !modality) { throw new Error("Esperado um userId (string), month (number), year (number) e modality(day_trade | swing_trade)") }
        try {
            const response = await api.post(`/resultados-fiscais`, {
                year,
                month,
                modality
            })
            return response.data
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    },
}

export default processFiscalResultService