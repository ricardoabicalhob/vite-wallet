import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import api from "./api"
import { AxiosError } from "axios"
import type { DarfI, DarfToUpdateI } from "@/interfaces/darf.interface"

const darfService = { 
    getDarfs: async (userId :string) => {
        try {
            const response = await api.get(`/darf?userId=${userId}`)

            return response.data
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    },

    createDarf: async (userId :string, year :number, month :number, modality :TradeModality) => {
        if(!userId || !year || !month || !modality) { throw new Error("Esperado um userId (string), month (number), year (number) e modality(day_trade | swing_trade)") }
        try {
            const response = await api.post(`/darf`, {
                userId,
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

    deleteDarf: async (id :string) => {
        if(!id) { throw new Error("Erro ao deletar a DARF") }
        try {
            const response = await api.delete(`/darf?id=${id}`)

            return response.data
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    },

    updateDarf: async (darfToUpdate :DarfToUpdateI) => {
        if(!darfToUpdate) { throw new Error("Erro ao atualizar a DARF") }
        try {
            const response = await api.patch('/darf', darfToUpdate)
            
            return response.data as DarfI
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    },

    updatePagamento: async (id :string) => {
        if(!id) { throw new Error("Erro ao atualizar o pagamento da DARF") }
        try {
            const response = await api.patch('/darf/paga', id)
            
            return response.data as DarfI
        } catch (error :unknown) {
            if(error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    },

    cancelPagamento: async (id :string) => {
        if(!id) { throw new Error("Erro ao cancelar o pagamento da DARF") }
        try {
            const response = await api.patch('/darf/desfazerpagamento', { id })
            
            return response.data as DarfI
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao desfazer o registro de pagamento'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default darfService