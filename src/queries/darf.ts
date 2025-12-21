import { useMutation, useQuery } from "@tanstack/react-query"
import { darfKeys } from "./keys"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import darfService from "@/services/darfService"
import { queryClient } from "@/services/queryClient"
import type { DarfI, DarfToUpdateI } from "@/interfaces/darf.interface"

type InputInfo = { userId :string, selectedYear :number, selectedMonth :number, tradeModality :TradeModality }

export const getDarfs = (userId :string) => {
    return useQuery<DarfI[]>({
        queryKey: darfKeys.list(userId),
        queryFn: () => darfService.getDarfs(userId),
        staleTime: 1000 * 60 * 5
    })
}

export const useCreateDarf = () => {
    return useMutation<DarfI , Error, InputInfo>({
        mutationFn: ({ userId, selectedYear, selectedMonth: month, tradeModality: modality } :InputInfo) => darfService.createDarf(userId, selectedYear, month, modality),
        onSuccess: (createdDarf, {userId, selectedYear, selectedMonth, tradeModality}) => {
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            createdDarf && queryClient.setQueryData(darfKeys.create(userId, selectedYear, selectedMonth, tradeModality), createdDarf)
        },
        onError: (error) => {
            console.error('Falha ao criar a Darf!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        }
    })
}

export const useDeleteDarf = () => {
    return useMutation<DarfI, Error, string>({
        mutationFn: (id :string) => darfService.deleteDarf(id),
        onSuccess: (deletedDarf, id) => {
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            deletedDarf && queryClient.setQueryData(darfKeys.delete(id), deletedDarf)
        },
        onError: (error) => {
            console.error('Falha ao excluir a DARF', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha            
        }
    })
}

export const useUpdateDarf = () => {
    return useMutation<DarfI | undefined, Error, DarfToUpdateI>({
        mutationFn: (darfToUpdate :DarfToUpdateI) => darfService.updateDarf(darfToUpdate),
        onSuccess: (updatedDarf) => {
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            updatedDarf && queryClient.setQueryData(darfKeys.update(updatedDarf), updatedDarf)
        },
        onError: (error) => {
            console.error('Falha ao atualizar a DARF', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        } 
    })
}

export const useUpdatePagamentoDarf = () => {
    return useMutation<DarfI | undefined, Error, string>({
        mutationFn: (id :string) => darfService.updatePagamento(id),
        onSuccess: (updatedDarf) => {
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            updatedDarf && queryClient.setQueryData(darfKeys.update(updatedDarf), updatedDarf)
        },
        onError: (error) => {
            console.error('Falha ao atualizar o pagamento da DARF', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        } 
    })
}

export const useCancelPagamentoDarf = () => {
    return useMutation<DarfI | undefined, Error, string>({
        mutationFn: (id :string) => darfService.cancelPagamento(id),
        onSuccess: (updatedDarf) => {
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            updatedDarf && queryClient.setQueryData(darfKeys.update(updatedDarf), updatedDarf)
        },
        onError: (error) => {
            console.error('Falha ao cancelar o pagamento da DARF', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        } 
    })
}