import type { AssetPresenter } from "@/interfaces/asset.interface"
import api from "./api"
import { AxiosError } from "axios"

const assetService = { 
    getAssets: async (userId :string) => {
        if(!userId) { throw new Error("Informe o ID do usuário") }
        try {
            const response = await api.get(`/ativo?userId=${userId}`)
            if(!response || !response.data) {
                return [] as AssetPresenter[]
            }
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
                    'Erro ao listar os ativos'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default assetService