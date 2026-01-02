import api from "./api"
import { AxiosError } from "axios"

const compensationService = { 
    getCompensations: async () => {
        try {
            const response = await api.get(`/compensacoes`)

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
                    'Erro ao consultar as compensações'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    getCompensationsByYear: async (year :number) => {
        try {
            const response = await api.get(`/compensacoes/ano?year=${year}`)

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
                    'Erro ao consultar as compensações'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    deleteCompensation: async (id :string) => {
        if(!id) { throw new Error("Erro ao deletar a DARF") }
        try {
            const response = await api.delete(`/compensacoes?id=${id}`)

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
                    'Erro ao excluir compensação'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default compensationService