import { Header } from "../../components/Header";
import { Input } from "../../components/input";
import { FormEvent, useState, useEffect } from "react";
import { FiTrash } from 'react-icons/fi'
import { db } from "../../services/firebaseConnection";
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

import { auth } from "../../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

interface LinkProps {
    id: string,
    name: string,
    url: string,
    bg: string,
    color: string,
    userId: string;
}

export function Admin() {
    const [nameInput, setNameInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [textColorInput, setTextColorInput] = useState('#f1f1f1');
    const [bgColorInput, setBgColorInput] = useState('');
    const [links, setLinks] = useState<LinkProps[]>([])
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.uid);
            }
        });

        const linksRef = collection(db, 'links')
        const queryRef = query(linksRef, orderBy('created', 'asc'))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let lista = [] as LinkProps[];
            snapshot.forEach((doc) => {
                lista.push({
                    userId: doc.data().userId, // Corrigido para userId
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })

            setLinks(lista);
        })
        return () => {
            unsub();
            unsubscribe();
        }
    }, [])

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        if (nameInput === '' || urlInput === '') {
            toast.error('Preencha todos os campos!!!');
            return;
        }

        const userId = currentUser || ''; // Certifica-se de que userId está definido

        addDoc(collection(db, "links"), {
            userId: userId,
            name: nameInput,
            url: urlInput,
            bg: bgColorInput,
            color: textColorInput,
            created: new Date()
        })
            .then(() => {
                toast.success("Link cadastrado com sucesso!")
                setNameInput('')
                setUrlInput('')
            })
            .catch((error) => {
                toast.error("Erro ao cadastrar no banco!" + error)
            })
    }

    async function handleDeleteLink(id: string) {
        const docRef = doc(db, 'links', id)
        await deleteDoc(docRef);
    }

    console.log(links);

    const filteredLinks = links.filter(links => links.userId === currentUser);


    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <form onSubmit={handleRegister} className="flex flex-col mt-8 mb-3 w-full max-w-xl">
                <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>
                <Input
                    placeholder="Digite o nome do link..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Url do Link</label>
                <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                />

                <section className="flex my-4 gap-5">
                    <div className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Cor do Link</label>
                        <input
                            type="color"
                            value={textColorInput}
                            onChange={(e) => setTextColorInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do Link</label>
                        <input
                            type="color"
                            value={bgColorInput}
                            onChange={(e) => setBgColorInput(e.target.value)}
                        />
                    </div>
                </section>

                {nameInput !== '' && (
                    <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                        <label className="text-white font-medium mt-2 mb-3">Veja como está ficando: </label>
                        <article className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3" style={{ marginBottom: 8, marginTop: 8, backgroundColor: bgColorInput }}>
                            <p className="font-medium" style={{ color: textColorInput }}>{nameInput}</p>
                        </article>
                    </div>
                )}

                <button type="submit" className="bg-blue-600 rounded-md text-white h-9 font-medium gap-4 flex justify-center items-center mb-7">
                    Cadastrar
                </button>
            </form>

            <h2 className="font-bold text-white mb-4 text-2xl">
                Meus Links
            </h2>

            {filteredLinks.map((link) => (
                <article
                    key={link.id}
                    className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                    style={{ backgroundColor: link.bg, color: link.color }}
                >
                    <p>{link.name}</p>
                    <div>
                        <button onClick={() => handleDeleteLink(link.id)} className="border border-dashed py-1 p-1 rounded bg-neutral-900">
                            <FiTrash size={18} color="#fff" />
                        </button>
                    </div>
                </article>
            ))}

        </div>
    )
}