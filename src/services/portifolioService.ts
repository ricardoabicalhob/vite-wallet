import api from "./api"
import { AxiosError } from "axios"

const portifolioService = { 
    getInfo: async (userId :string) => {
        if(!userId) { throw new Error("Informe o ID do usuário") }
        try {
            const response = await api.get(`/portifolio?userId=${userId}`)
            
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
                    'Erro ao consultar o seu portifolio'
                )
            }

            throw new Error('Erro inesperado')
        }
    }
}

export default portifolioService