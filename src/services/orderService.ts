import type { OrderCreate, OrderPresenter, OrderToUpdate } from "@/interfaces/order.interface"
import api from "./api"
import { AxiosError } from "axios"

const orderService = { 
    createOrder: async (orderToCreate :OrderCreate) => {
        if(!orderToCreate) { throw new Error("Erro durante a criação da ordem") }
        try {
            const response = await api.post('/ordem', orderToCreate)
            
            return response.data as OrderPresenter
        } catch (error :unknown) {
             if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao criar a ordem'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    deleteOrder: async (id :string | undefined) => {
        if(!id) { throw new Error("Erro ao deletar a ordem") }
        
        try {
            const response = await api.delete(`/ordem?id=${id}`)

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
                    'Erro ao excluir a ordem'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    updateOrder: async (orderToUpdate :OrderToUpdate) => {
        if(!orderToUpdate) { throw new Error("Erro ao atualizar a ordem") }
        try {
            const response = await api.patch('/ordem', orderToUpdate)
            
            return response.data as OrderPresenter
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao atualizar a ordem'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    listByMonth: async (userId :string, year :number, month :number) => {
        if(!userId || year === undefined || month === undefined) { throw new Error("ID do usuário, mês ou ano inválidos.") }
        try {
            const response = await api.get(`/ordem/mes?userId=${userId}&year=${year}&month=${month}`)

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
                    'Erro ao listar as ordens'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    getOrders: async (userId :string) => {
        if(!userId) { throw new Error("Informe o ID do usuário") }
        try {
            const response = await api.get(`/ordem?userId=${userId}`)
            return response.data || null
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao listar as ordens'
                )
            }

            throw new Error('Erro inesperado')
        }
    },

    getOrdersByYear: async (userId :string, year :number) => {
        if(!userId) { throw new Error("Informe o ID do usuário") }
        try {
            const response = await api.get(`/ordem/ano?userId=${userId}&year=${year}`)
            return response.data || null
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao listar as ordens'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default orderService