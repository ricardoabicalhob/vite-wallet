import type { SessionStoragePayloadInterface } from '@/interfaces/login.interface'
import { getAuthToken } from '@/repositories/localStorageAuth'
import axios from 'axios'

export const publicApi = axios.create({
    timeout: 10000
})

const api = axios.create({
    baseURL: "http://localhost:3100",
    timeout:10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {

    try {           
        const authToken = getAuthToken()
            if(!authToken) {
                console.log("Nenhum token encontrado no localStorage.")
            } else {
                let authTokenDecoded :SessionStoragePayloadInterface
                try {
                    authTokenDecoded = JSON.parse(authToken)

                    config.headers.Authorization = `Bearer ${authTokenDecoded.objetoResposta.token}`
                } catch (parseError) {
                    console.error("Erro ao fazer parse do token JWT do localStorage:", parseError)
                }
            }        
    } catch (error) {
        console.error("Erro na inicialização da autenticação:", error)
    }

    return config
})

export default api