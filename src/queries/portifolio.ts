import { useQuery } from "@tanstack/react-query"
import { portifolioKeys } from "./keys"
import portifolioService from "@/services/portifolioService"
import type { PortifolioSummary } from "@/interfaces/portifolio.interface"

export const usePortifolio = (userId :string) => {
    return useQuery<PortifolioSummary>({
        queryKey: portifolioKeys.list(),
        queryFn: ()=> portifolioService.getInfo(userId),
        staleTime: 1000 * 60 * 5
    })
}