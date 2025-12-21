import api from "./api"
import { AxiosError } from "axios"

const planningService = { 
    getInfo: async (userId :string, investment :number) => {
        if(!userId) { throw new Error("Esperado um userId (string)") }
        try {
            const response = await api.get(`/planejamento?userId=${userId}&investment=${investment}`)
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
                    'Erro ao consultar o seu planejamento'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default planningService