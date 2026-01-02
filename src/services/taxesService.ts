import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import api from "./api"
import { AxiosError } from "axios"

const taxesService = { 
    getInfo: async (year :number | undefined, month :number | undefined, modality :TradeModality) => {
        if(year === null || month === null) { throw new Error("Esperado um ano (number) e um mês (number)") }
        try {
            const response = await api.get(`/impostos?year=${year}&month=${month}&modality=${modality}`)
            return response.data
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao consultar o resumo de impostos'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default taxesService