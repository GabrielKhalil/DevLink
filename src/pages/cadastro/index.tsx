import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useState, FormEvent } from 'react'
import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Cadastro() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate();

    function cadastrarConta(e: FormEvent) {
        e.preventDefault();

        if (email === '' || senha === '' || confirmarSenha === '') {
            toast.error('Preencha todos os campos!!!');
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error('Confirme a sua senha!!!');
            return;
        }

        createUserWithEmailAndPassword(auth, email, confirmarSenha)
            .then(() => {
                toast.success('Conta cadastrada com sucesso!');
                navigate('/', {replace:true})
            })

            .catch((error) => {
                toast.error(`Erro ao cadastrar a conta: ${error.message}`);
            })
    }

    return (
        <div className="w-full h-screen items-center justify-center flex flex-col">
            <Link to='/'>
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
                    Cadastro Dev
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent text">Link</span> <br />
                </h1>
            </Link>

            <form onSubmit={cadastrarConta} className="w-full max-w-xl flex flex-col px-2">
                <Input
                    placeholder="Digite o seu email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    placeholder="Digite sua senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <Input
                    placeholder="Confirme a sua senha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <button type="submit" className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white">
                    Cadastrar
                </button>
            </form>
        </div>

    )
}