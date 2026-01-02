import { useQuery } from "@tanstack/react-query"
import { planningKeys } from "./keys"
import type { PlanningSumary } from "@/interfaces/planning.interface"
import planningService from "@/services/planningService"

// type PlanningPayload = { userId :string, investment :number }

export const usePlanning = (investment :number) => {
    return useQuery<PlanningSumary>({
        queryKey: planningKeys.list(investment),
        queryFn: ()=> planningService.getInfo(investment),
        staleTime: 1000 * 60 * 5,
    })
}