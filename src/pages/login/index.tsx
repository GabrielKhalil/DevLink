import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useState, FormEvent } from 'react'
import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (email === '' || password === '') {
            toast.error('Preencha todos os campos.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success("Login efetuado com sucesso!!!")
                navigate('/admin', { replace: true })
            })

            .catch((error) => {
                toast.error("Erro ao fazer login!!!")
                console.log(error);

            })
    }

    return (
        <div className="w-full h-screen items-center justify-center flex flex-col">
            <Link to='/'>
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
                    Dev
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">Link</span>
                </h1>
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col px-2">
                <Input
                    placeholder="Digite o seu email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    placeholder="********"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white">
                    Acessar
                </button>
                <Link to='/cadastro'>
                    <p className=" mb-7 font-bold mt-2 text-white text-1xl">Não possui conta? Cadastre-se aqui</p>
                </Link>
            </form>
        </div>
    )
}