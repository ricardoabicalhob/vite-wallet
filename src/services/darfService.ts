import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import api from "./api"
import { AxiosError } from "axios"
import type { DarfI, DarfToUpdateI } from "@/interfaces/darf.interface"

const darfService = { 
    getDarfs: async () => {
        try {
            const response = await api.get(`/darfs`)

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
                    'Erro ao consultar as DARFs'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    getDarfsByYear: async (year :number) => {
        try {
            const response = await api.get(`/darfs/ano?year=${year}`)

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
                    'Erro ao consultar as DARFs'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    createDarf: async (year :number, month :number, modality :TradeModality) => {
        if(!year || !month || !modality) { throw new Error("Esperado um userId (string), month (number), year (number) e modality(day_trade | swing_trade)") }
        try {
            const response = await api.post(`/darfs`, {
                year,
                month,
                modality
            })
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
                    'Erro ao criar DARF'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    deleteDarf: async (id :string) => {
        if(!id) { throw new Error("Erro ao deletar a DARF") }
        try {
            const response = await api.delete(`/darfs?id=${id}`)

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
                    'Erro ao excluir DARF'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    updateDarf: async (darfToUpdate :DarfToUpdateI) => {
        if(!darfToUpdate) { throw new Error("Erro ao atualizar a DARF") }
        try {
            const response = await api.patch('/darfs', darfToUpdate)
            
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
                    'Erro ao atualizar DARF'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    updatePagamento: async (id :string) => {
        if(!id) { throw new Error("Erro ao atualizar o pagamento da DARF") }
        try {
            const response = await api.patch('/darfs/paga', id)
            
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
                    'Erro ao atualizar o registro de pagamento'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    cancelPagamento: async (id :string) => {
        if(!id) { throw new Error("Erro ao cancelar o pagamento da DARF") }
        try {
            const response = await api.patch('/darfs/desfazerpagamento', { id })
            
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