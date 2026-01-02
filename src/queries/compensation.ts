import { useMutation, useQuery } from "@tanstack/react-query"
import { compensationKeys } from "./keys"
import { queryClient } from "@/services/queryClient"
import type { CompensationResponse } from "@/interfaces/compensation.interface"
import compensationService from "@/services/compensationService"

export const useCompensation = () => {
    return useQuery<CompensationResponse[]>({
        queryKey: compensationKeys.list(),
        queryFn: () => compensationService.getCompensations(),
        staleTime: 1000 * 60 * 5
    })
}

export const UseCompensationByYear = (year :number) => {
    return useQuery<CompensationResponse[]>({
        queryKey: compensationKeys.getByUserIdAndYear(year),
        queryFn: () => compensationService.getCompensationsByYear(year),
        staleTime: 1000 * 60 * 5
    })
}

export const useDeleteCompensation = () => {
    return useMutation<CompensationResponse, Error, string>({
        mutationFn: (id :string) => compensationService.deleteCompensation(id),
        onSuccess: (deletedCompensation, id) => {
            queryClient.invalidateQueries({ queryKey: compensationKeys.all })
            deletedCompensation && queryClient.setQueryData(compensationKeys.delete(id), deletedCompensation)
        },
        onError: (error) => {
            console.error('Falha ao excluir compensação', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha            
        }
    })
}