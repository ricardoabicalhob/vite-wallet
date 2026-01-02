import type { OrderCreate, OrderPresenter, OrderToUpdate } from "@/interfaces/order.interface"
import api from "./api"
import { AxiosError } from "axios"

const orderService = { 
    createOrder: async (orderToCreate :OrderCreate) => {
        if(!orderToCreate) { throw new Error("Erro durante a criação da ordem") }
        try {
            const response = await api.post('/ordens', orderToCreate)
            
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
            const response = await api.delete(`/ordens?id=${id}`)

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
            const response = await api.patch('/ordens', orderToUpdate)
            
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
    listByMonth: async (year :number, month :number) => {
        if(year === undefined || month === undefined) { throw new Error("ID do usuário, mês ou ano inválidos.") }
        try {
            const response = await api.get(`/ordens/mes?year=${year}&month=${month}`)

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
    getOrders: async () => {
        try {
            const response = await api.get(`/ordens`)
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

    getOrdersByYear: async (year :number) => {
        try {
            const response = await api.get(`/ordens/ano?year=${year}`)
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