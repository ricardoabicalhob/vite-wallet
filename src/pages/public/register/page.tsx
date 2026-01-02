import MyInputPassword from "@/components/my-input-password";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { fullNameFormat } from "@/utils/formatters";

import { setAuthToken } from "@/repositories/localStorageAuth";
import type { LoginResponseInterface, SessionStoragePayloadInterface, TokenPayload } from "@/interfaces/login.interface";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import logoInvesIR from "../../../assets/images/logo-investir-fundo-transparente.png"
import logoParcialIR from "../../../assets/images/parte-logo-IR-fundo-transparente.png"

const userSchema = z.object({
    fullName: z.string().min(2, {
        message: "Preencha seu nome"
    }),
    email: z.string().email({
        message: "E-mail inválido"
    }),
    password: z.string().min(8, {
        message: 'A senha deve conter no mínimo 8 caracteres'
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&{}.;])[A-Za-z\d@#$!%*?&{}.;]{8,}$/, {
        message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.'
    }),
    confirmPassword: z.string().min(8, {
        message: 'Confirmação de senha deve ter ao menos 8 caracteres', 
    })
}).refine(dados => dados.password === dados.confirmPassword, {
  message: 'Senhas não correspondem',
  path: ['confirmPassword']
}).refine(dados => dados.fullName.split(' ').length > 1 && dados.fullName.split(' ')[1].length >= 1, {
  message: 'Digite seu nome completo',
  path: ['fullName']
})

type userSchema = z.infer<typeof userSchema>

export default function RegisterPage() {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<userSchema>({
        resolver: zodResolver(userSchema)
    })

    const onSubmint = (data :userSchema)=> {
        const dataFormated :userSchema = {
            ...data,
            fullName: fullNameFormat(data.fullName)
        }
        handleRegister(dataFormated)
    }

    const handleRegister = async (data :userSchema)=> {
        const response = await fetch('http://localhost:3100/usuarios', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.fullName,
                email: data.email,
                password: data.password
            })
        })

        if(!response.ok) {
            const errorData = await response.json()
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorData.message || 'Erro desconhecido'}`)
        }

        handleLogin(data.email, data.password)
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
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorData.message || 'Erro desconhecido'}`)
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
        toast(`Seja bem-vindo, ${authenticatedUser.objetoResposta.name}! Ficamos muito felizes com o seu cadastro. Parabéns!`, {
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
            position: "bottom-right",
            duration: 5000
        })
        navigate('/carteira', {replace: true})
    }

    return(
        <div className="flex h-screen items-stretch">
            <div className="flex-1 bg-cover bg-center max-[1100px]:hidden bg-linear-150 from-lime-base to-white">
                <div className="flex gap-2 w-full h-full items-center justify-center">
                    <img src={logoInvesIR} width={300} alt="logo-investir-register" />
                </div>
            </div>

            <div className="flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1">
                <div className="h-[100dvh] bg-my-background-secondary p-20 overflow-auto custom-scrollbar max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7">
                    <div className="flex flex-col">
                        <div className="flex gap-2 items-center">
                            <div 
                                className="flex items-center z-50 text-my-foreground-secondary select-none font-semibold" 
                                style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '4px', fontSize: 24}}
                            >
                                Invest
                                <img src={logoParcialIR} width={40} alt="logo-investir-menor-register" />
                            </div>
                        </div>

                        <h1 className="mb-7 mt-16 text-[26px] font-bold text-my-foreground-secondary max-md:mb-8 max-md:mt-12">Cadastre-se gratuitamente</h1>

                        <form onSubmit={handleSubmit(onSubmint)} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2 [&>label]:text-sm [&>label]:text-my-foreground-secondary">
                                <label htmlFor="name">Nome completo</label>
                                <div className={`flex w-full h-12 px-4 py-3 justify-center items-center gap-2 rounded-sm border border-solid ${errors.fullName && '!border-red-destructive !focus:border-red-destructive'} border-[#29292E] bg-my-background box-border transition-opacity focus-within:border-lime-base`}>
                                    <input
                                        className={`outline-none border-none w-full h-full text-my-foreground-secondary text-base font-normal bg-transparent placeholder:text-my-foreground transition-colors`}
                                        placeholder="Seu nome completo"
                                        type="text" 
                                        {...register('fullName')}
                                    />
                                </div>
                                { errors.fullName && <p className="text-red-destructive text-sm">{errors.fullName.message}</p> }
                            </div>

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

                            <div className="flex flex-col gap-2 [&>label]:text-sm [&>label]:text-my-foreground-secondary">
                                <label htmlFor="password">Senha</label>
                               
                                <MyInputPassword
                                    className={` ${errors.password && '!border-red-destructive !focus:border-red-destructive'}`}
                                    {...register('password')}
                                    placeholder="Deve ter no mínimo 8 caracteres"
                                    autoComplete="current-password"
                                />
                                { errors.password && <p className="text-red-destructive text-sm">{errors.password.message}</p> }
                            </div>

                            <div className="flex flex-col gap-2 [&>label]:text-sm [&>label]:text-my-foreground-secondary">
                                <label htmlFor="passwordConfirmation">Confirme sua senha</label>
                                
                                <MyInputPassword
                                    className={` ${errors.confirmPassword && '!border-red-destructive !focus:border-red-destructive'}`}
                                    {...register('confirmPassword')}
                                    placeholder="Deve ter no mínimo 8 caracteres"
                                    autoComplete="current-password"
                                />
                                { errors.confirmPassword && <p className="text-red-destructive text-sm">{errors.confirmPassword.message}</p> }
                            </div>

                            <button 
                                type="submit" 
                                className="relative inline-flex flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-lime-base hover:enabled:brightness-115 text-my-background-secondary text-shadow-xs text-shadow-lime-base px-4 py-3 [&amp;_svg]:size-6 text-md leading-[1.5rem]"
                            >
                                Cadastrar-se gratuitamente
                            </button>
                        </form>

                        <div className="mb-6 mt-16 h-[2px] w-full bg-[#29292E] max-md:mt-12"></div>

                        <a href="/sign-in">
                            <div 
                                className="flex w-full gap-4 rounded-md border border-[#323238] bg-[#29292E] px-6 py-4 transition hover:brightness-125"
                            >
                                <span className="material-symbols-outlined text-lime-base" style={{fontSize: 28}}>logout</span>
                                
                                <div 
                                    className="flex flex-col text-my-foreground-secondary"
                                >
                                    Já possui uma conta?
                                    <span className="font-medium text-lime-secondary">Entre na plataforma</span>
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