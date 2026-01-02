import { useMutation, useQuery } from "@tanstack/react-query"
import { assetKeys } from "./keys"
import type { AssetPresenter, ValidatedAssetSymbolPayload } from "@/interfaces/asset.interface"
import assetService from "@/services/assetService"
import { queryClient } from "@/services/queryClient"

export const useAssets = () => {
    return useQuery<AssetPresenter[]>({
        queryKey: assetKeys.list(),
        queryFn: ()=> assetService.getAssets(),
        staleTime: 1000 * 60 * 5
    })
}

export const useValidateAssetSymbol = () => {
    return useMutation<ValidatedAssetSymbolPayload , Error, string>({
        mutationFn: (symbol :string) => assetService.validateAssetSymbol(symbol),
        onSuccess: (validatedAsset, symbol) => {
            queryClient.invalidateQueries({ queryKey: assetKeys.all })
            validatedAsset && queryClient.setQueryData(assetKeys.validadeAssetSymbol(symbol), validatedAsset)
        },
        onError: (error) => {
            console.error('Falha ao validar o ticket do ativo!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        }
    })
}