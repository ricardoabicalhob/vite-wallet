import { useQuery } from "@tanstack/react-query"
import { taxesKeys } from "./keys"
import type { TaxesI } from "@/interfaces/taxes.interface"
import taxesService from "@/services/taxesService"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"

export const useTaxes = (userId :string, year :number | undefined, month :number | undefined, modality :TradeModality) => {
    return useQuery<TaxesI>({
        queryKey: taxesKeys.list(userId, year, month, modality),
        queryFn: ()=> taxesService.getInfo(userId, year, month, modality),
        staleTime: 1000 * 60 * 5,
    })
}