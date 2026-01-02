import api from "./api"
import { AxiosError } from "axios"

const planningService = { 
    getInfo: async (investment :number) => {
        try {
            const response = await api.get(`/planejamentos?investment=${investment}`)
            return response.data
        } catch (error :unknown) {
            
            if (error instanceof AxiosError) {
                const data = error.response?.data.message
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