import type { RecommendedAssetCreate, RecommendedAssetPresenter, RecommendedAssetUpdatePlannedPercentage } from "@/interfaces/recommendedAsset.interface"
import api from "./api"
import { AxiosError } from "axios"

const recommendedAssetService = { 
    createRecommendedAsset: async (recommendedAsset :RecommendedAssetCreate) => {
        if(!recommendedAsset) { throw new Error("Erro durante a criação do ativo recomendado") }
        try {
            const response = await api.post('/ativorecomendado', recommendedAsset)
            
            return response.data as RecommendedAssetPresenter
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao incluir ativo no planejamento'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    deleteRecommendedAsset: async (id :string) => {
        if(!id) { throw new Error("Erro ao deletar o ativo!") }
        try {
            const response = await api.delete(`/ativorecomendado?id=${id}`)

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
                    'Erro ao excluir ativo do planejamento'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    updatePlannedPercentage: async (recommendedAssetToUpdate :RecommendedAssetUpdatePlannedPercentage) => {
        if(!recommendedAssetToUpdate) { throw new Error("Erro ao atualizar o ativo recomendado!") }
        try {
            const response = await api.patch('/ativorecomendado', recommendedAssetToUpdate)
            
            return response.data as RecommendedAssetPresenter
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao atualizar o ativo planejado'
                )
            }

            throw new Error('Erro inesperado')
        }
    },
    getRecommendedAssets: async (userId :string) => {
        if(!userId) { throw new Error("Informe o ID do usuário") }
        try {
            const response = await api.get(`/ativorecomendado?userId=${userId}`)
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
                    'Erro ao listar os ativos planejados'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default recommendedAssetService