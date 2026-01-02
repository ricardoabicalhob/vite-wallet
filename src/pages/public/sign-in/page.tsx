import MyInputPassword from "@/components/my-input-password"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'

import type { SessionStoragePayloadInterface, LoginResponseInterface, TokenPayload } from "@/interfaces/login.interface"
import { setAuthToken } from "@/repositories/localStorageAuth"
import { useNavigate } from "react-router"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/auth.context"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"
import logoInvesIR from "../../../assets/images/logo-investir-fundo-transparente.png"
import logoParcialIR from "../../../assets/images/parte-logo-IR-fundo-transparente.png"

const userSchema = z.object({
    email: z.string().email({
        message: 'E-mail inválido'
    }),
    password: z.string().min(8, {
        message: 'Senha deve ter ao menos 8 caracteres'
    })
})

type userSchema = z.infer<typeof userSchema>

export default function SignInPage() {

    const navigate = useNavigate()
    const { loginResponse } = useContext(AuthContext)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<userSchema>({
        resolver: zodResolver(userSchema)
    })

    const onSubmint = (data :userSchema) => {
        handleLogin(data.email, data.password)
        // console.log(data)
    }

    type Position = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right' | undefined

    const showWelcomeToast = (message :string) => {
        const windowWidth = window.innerWidth
        let toastPosition :Position = 'bottom-right'

        if(windowWidth < 1100) {
            toastPosition = 'top-left'
        }

        toast(message, {
            style: {
                backgroundColor: "#29292E",
                color: "var(--my-foreground-secondary)",
                borderColor: "#323238",
                borderBottomColor: "var(--lime-base)",
                borderBottomWidth: 3,
                minWidth: 520,
                width: "90%",
                height: 64,
                fontSize: 15
            },
            position: toastPosition,
        })
    }

    async function handleLogin(email :string, password :string) {
        const response = await fetch("http://localhost:3100/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        if(!response.ok) {
            const errorData = await response.json()
            // throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorData.message || 'Erro desconhecido'}`)
            toast(`${errorData.error || 'Erro desconhecido'}`, {
                style: {
                    backgroundColor: "#29292E",
                    color: "var(--my-foreground-secondary)",
                    borderColor: "#323238",
                    borderBottomColor: "var(--lime-base)",
                    borderBottomWidth: 3,
                    minWidth: 520,
                    width: "90%",
                    height: 64,
                    fontSize: 15
                },
                position: "top-right",
            })
        }

        const data :LoginResponseInterface = await response.json()

        const decodedData = jwtDecode<TokenPayload>(data.token)
        
        const authenticatedUser :SessionStoragePayloadInterface = {
            error: false,
            objetoResposta: {
                email: decodedData.email,
                name: decodedData.name,
                role: decodedData.role,
                id: decodedData.id,
                token: data.token
            }
        }

        setAuthToken(JSON.stringify(authenticatedUser))
        showWelcomeToast(`Bem-vindo, ${authenticatedUser.objetoResposta.name}!`)
        navigate('/carteira')
    }

    useEffect(()=> {
        if(!!loginResponse) {
            navigate('/carteira', { replace: true })
        }
    }, [loginResponse])

    return(
        <div className="flex h-screen items-stretch">
            <div className="flex-1 bg-cover bg-center max-[1100px]:hidden bg-linear-150 from-lime-base to-white">
                <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
                    <img src={logoInvesIR} width={300} alt="logo-investir-signup" />
                    <p className="text-my-background-secondary/70 text-xl text-center font-semibold">Gestão de carteira, planejamento e<br/>
                        cálculo automático de Imposto de Renda.</p>
                </div>
            </div>

            <div className="flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1">
                <div className="h-[100dvh] bg-my-background-secondary p-20 overflow-auto max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7 custom-scrollbar">
                    <div className="flex flex-col">
                        <div className="flex gap-2 items-center">
                            <div 
                                className="flex items-center z-50 text-my-foreground-secondary select-none font-semibold" 
                                style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '4px', fontSize: 24}}
                            >
                                Invest
                                <img src={logoParcialIR} width={40} alt="logo-investir-menor-signup" />
                            </div>
                        </div>

                        <h1 className="mb-7 mt-16 text-[26px] font-bold text-my-foreground-secondary max-md:mb-8 max-md:mt-12">Acesse sua conta</h1>

                        <form onSubmit={handleSubmit(onSubmint)} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2 [&>label]:text-sm [&>label]:text-my-foreground-secondary">
                                <label htmlFor="email">E-mail</label>
                                <div className={`flex w-full h-12 px-4 py-3 justify-center items-center gap-2 rounded-sm border border-solid ${errors.email && '!border-red-destructive !focus:border-red-destructive'} border-[#29292E] bg-my-background box-border transition-opacity focus-within:border-lime-base`}>
                                    <input
                                        className="outline-none border-none w-full h-full text-my-foreground-secondary text-base font-normal bg-transparent placeholder:text-my-foreground transition-colors"
                                        placeholder="Seu e-mail"
                                        type="email" 
                                        {...register('email')}
                                    />
                                </div>
                                { errors.email && <p className="text-red-destructive text-sm">{errors.email.message}</p> }
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2 [&>label]:text-sm [&>label]:text-my-foreground-secondary">
                                    <label htmlFor="password">Senha</label>
                                    
                                    <MyInputPassword
                                        className={` ${errors.password && '!border-red-destructive !focus:border-red-destructive'}`}
                                        {...register('password')}
                                        placeholder="Sua senha"
                                        autoComplete="current-password"
                                    />
                                    { errors.password && <p className="text-red-destructive text-sm">{errors.password.message}</p> }
                                    
                                </div>

                                <a className="text-sm font-medium text-lime-secondary hover:brightness-125 transition" href="/">Esqueci minha senha</a>
                            </div>

                            <button 
                                type="submit" 
                                className="relative inline-flex flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-lime-base hover:enabled:brightness-115 text-my-background-secondary text-shadow-xs text-shadow-lime-base px-4 py-3 [&amp;_svg]:size-6 text-md leading-[1.5rem]"
                            >
                                Entrar
                            </button>
                        </form>

                        <div className="mb-6 mt-16 h-[2px] w-full bg-[#29292E] max-md:mt-12"></div>

                        <a href="/register">
                            <div 
                                className="flex w-full gap-4 rounded-md border border-[#323238] bg-[#29292E] px-6 py-4 transition hover:brightness-125"
                            >
                                <span className="material-symbols-outlined text-lime-base" style={{fontSize: 28}}>person_add</span>
                                
                                <div 
                                    className="flex flex-col text-my-foreground-secondary"
                                >
                                    Não tem uma conta?
                                    <span className="font-medium text-lime-secondary">Crie sua conta grátis</span>
                                </div>

                                <span className="material-symbols-outlined ml-auto self-center text-my-foreground" style={{fontSize: 12}}>arrow_forward_ios</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}