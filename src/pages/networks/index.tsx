import { Header } from "../../components/Header";
import { Input } from "../../components/input";
import { useState, FormEvent, useEffect } from "react";
import { auth, db } from "../../services/firebaseConnection";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";



export function Networks() {
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.uid);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            loadLinks();
        }
    }, [currentUser]);

    function loadLinks() {
        getDoc(doc(db, 'social', 'links'))
            .then((snapshot) => {
                if (snapshot.data() !== undefined) {
                    setFacebook(snapshot.data()?.facebook)
                    setInstagram(snapshot.data()?.instagram)
                    setYoutube(snapshot.data()?.youtube)
                }
            })
            .catch((error) => {
                console.error("Error fetching document:", error);
            });
    }

    function handleRegister(e: FormEvent) {
        e.preventDefault();

        setDoc(doc(db, 'social', 'links'), {
            facebook: facebook,
            instagram: instagram,
            youtube: youtube,
            userId: currentUser
        })
            .then(() => {
                toast.success("Cadastrados com sucesso!");
            })
            .catch((error) => {
                toast.error("Erro ao fazer cadastro! " + error);
            });
    }
    



    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <h1 className="text-white text-2xl font-medium mt-8 mb-4">Minhas redes sociais</h1>

            <form onSubmit={handleRegister} className="flex flex-col max-w-xl w-full">
                <label className="text-white font-medium mt-2 mb-2">Link do facebook</label>
                <Input
                    type="url"
                    placeholder="Digite a url do facebook..."
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do instagram</label>
                <Input
                    type="url"
                    placeholder="Digite a url do seu instagram..."
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do youtube</label>
                <Input
                    type="url"
                    placeholder="Digite a url do youtube..."
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                />

                <button
                    type="submit"
                    className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium"
                >
                    Salvar links
                </button>
            </form>
        </div>
    )
}