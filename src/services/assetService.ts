import type { AssetPresenter, ValidatedAssetSymbolPayload } from "@/interfaces/asset.interface"
import api from "./api"
import { AxiosError } from "axios"

const assetService = { 
    getAssets: async () => {
        try {
            const response = await api.get(`/ativos`)
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
    },

    validateAssetSymbol: async (symbol :string) => {
        try {
            const response = await api.get(`/ativos/validacao?symbol=${symbol}`)
            // if(!response || !response.data) {
            //     return [] as AssetPresenter[]
            // }
            return response.data as ValidatedAssetSymbolPayload
        } catch (error :unknown) {
            if (error instanceof AxiosError) {
                const data = error.response?.data

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    data?.error ||
                    'Erro ao validar o ticket do ativo'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default assetService