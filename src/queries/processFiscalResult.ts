import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import type { ProcessFiscalResultResponse } from "@/interfaces/processFiscalResult.interface"
import processFiscalResultService from "@/services/processFiscalResultService"
import { queryClient } from "@/services/queryClient"
import { useMutation } from "@tanstack/react-query"
import { compensationKeys, darfKeys, processFiscalResultKeys } from "./keys"

type InputInfo = { selectedYear :number, selectedMonth :number, tradeModality :TradeModality }

export const useProcessFiscalResult = () => {
    return useMutation<ProcessFiscalResultResponse , Error, InputInfo>({
        mutationFn: ({ selectedYear, selectedMonth: month, tradeModality: modality } :InputInfo) => processFiscalResultService.execute(selectedYear, month, modality),
        onSuccess: (createdProcessFiscalResult, {selectedYear, selectedMonth, tradeModality}) => {
            queryClient.invalidateQueries({ queryKey: processFiscalResultKeys.all })
            queryClient.invalidateQueries({ queryKey: darfKeys.all })
            queryClient.invalidateQueries({ queryKey: compensationKeys.all })
            createdProcessFiscalResult && queryClient.setQueryData(processFiscalResultKeys.create(selectedYear, selectedMonth, tradeModality), createdProcessFiscalResult)
        },
        onError: (error) => {
            console.error('Falha ao criar a Darf!', error)
        },
        onSettled: () => {
            //isso é executado independente do sucesso ou falha
        }
    })
}
