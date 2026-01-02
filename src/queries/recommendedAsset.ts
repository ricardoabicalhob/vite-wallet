import { useMutation, useQuery } from "@tanstack/react-query"
import { assetKeys, orderKeys, planningKeys, recommendedAssetKeys } from "./keys"
import type { RecommendedAssetCreate, RecommendedAssetPresenter, RecommendedAssetUpdatePlannedPercentage } from "@/interfaces/recommendedAsset.interface"
import recommendedAssetService from "@/services/recommendedAssetService"
import { queryClient } from "@/services/queryClient"

// export const useRecommendedAssets = (userId :string) => {
//     return useQuery<RecommendedAssetPresenter[]>({
//         queryKey: recommendedAssetKeys.list(),
//         queryFn: ()=> recommendedAssetService.getRecommendedAssets(userId),
//         staleTime: 1000 * 60 * 5
//     })
// }

export const useCreateRecommendedAsset = () => {
    return useMutation<RecommendedAssetCreate | undefined , Error, RecommendedAssetCreate>({
        mutationFn: (recommendedAssetToCreate :RecommendedAssetCreate) => recommendedAssetService.createRecommendedAsset(recommendedAssetToCreate),
        onSuccess: (createdRecommendedAsset) => {
            queryClient.invalidateQueries({ queryKey: recommendedAssetKeys.all })
            queryClient.invalidateQueries({ queryKey: planningKeys.all })
            createdRecommendedAsset && queryClient.setQueryData(recommendedAssetKeys.create(createdRecommendedAsset), createdRecommendedAsset)
        },
        onError: (error) => {
            console.error('Falha ao criar o ativo recomendado!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        }
    })
}

export const useDeleteRecommendedAsset = () => {
    return useMutation<string | undefined, Error, string>({
        mutationFn: (id :string) => recommendedAssetService.deleteRecommendedAsset(id),
        onSuccess: (deletedRecommendedAsset) => {
            queryClient.invalidateQueries({ queryKey: recommendedAssetKeys.all })
            queryClient.invalidateQueries({ queryKey: assetKeys.all })
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
            queryClient.invalidateQueries({ queryKey: planningKeys.all })
            deletedRecommendedAsset && queryClient.setQueryData(recommendedAssetKeys.delete(deletedRecommendedAsset), deletedRecommendedAsset)
        },
        onError: (error) => {
            console.error('Falha ao excluir o ativo!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha            
        }
    })
}

export const useUpdateRecommendedAssetPlannedPercentage = () => {
    return useMutation<RecommendedAssetUpdatePlannedPercentage | undefined, Error, RecommendedAssetUpdatePlannedPercentage>({
        mutationFn: (recommendedAssetToUpdate :RecommendedAssetUpdatePlannedPercentage) => recommendedAssetService.updatePlannedPercentage(recommendedAssetToUpdate),
        onSuccess: (updatedRecommendedAsset) => {
            queryClient.invalidateQueries({ queryKey: recommendedAssetKeys.all })
            queryClient.invalidateQueries({ queryKey: planningKeys.all })
            updatedRecommendedAsset && queryClient.setQueryData(recommendedAssetKeys.updatePlannedPercentage(updatedRecommendedAsset), updatedRecommendedAsset)
        },
        onError: (error) => {
            console.error('Falha ao atualizar o ativo recomendado!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        } 
    })
}