import { Social } from "../../components/Social"
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { auth, db } from '../../services/firebaseConnection'
import { getDocs, collection, orderBy, query, doc, getDoc } from "firebase/firestore"
import { useEffect, useState, } from "react"
import { useParams } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"


interface LinkProps {
    id: string,
    name: string,
    url: string,
    bg: string,
    color: string,
    userId?: string;
}
interface SocialLinksProps {
    facebook: string;
    youtube: string;
    instagram: string;
    userId?: string;
}
export function Home() {

    const { uid } = useParams();
    const [links, setLinks] = useState<LinkProps[]>([])
    const [socialLinks, setSocialLinks] = useState<SocialLinksProps>()
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
        }
    }, [currentUser]);

    useEffect(() => {
        function loadLinks() {
            const linksRef = collection(db, 'links')
            const queryRef = query(linksRef, orderBy("created", 'asc'))
            getDocs(queryRef)
                .then((snapshot) => {
                    let lista = [] as LinkProps[]
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            name: doc.data().name,
                            color: doc.data().color,
                            bg: doc.data().bg,
                            url: doc.data().url,
                            userId: doc.data().userId
                        })
                    })
                    setLinks(lista);
                })
        }
        loadLinks();
    }, [])
    useEffect(() => {
        function loadSocialLinks() {
            const docRef = doc(db, 'social', `${uid}`);
            getDoc(docRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        setSocialLinks({
                            facebook: snapshot.data()?.facebook,
                            instagram: snapshot.data()?.instagram,
                            youtube: snapshot.data()?.youtube,
                            userId: snapshot.data()?.userId
                        });
                    }
                })
                .catch((error) => {
                    console.error("Erro ao carregar os links sociais: ", error);
                });
        }
        loadSocialLinks();
    }, [currentUser, db]);
    const filteredLinks = links.filter(links => links.userId === uid);
    return (
        <div className="flex flex-col w-full py-4 items-center justify-center">
            <h1 className="mt-11 text-white mb-2 font-bold text-5xl">
                Dev
                <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">Link</span>
            </h1>
            <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>
            <main className="flex flex-col w-11/12 max-w-xl text-center">
                {filteredLinks.map((link) => (
                    <section key={link.id} className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer" style={{ transitionDuration: '0.5s', backgroundColor: link.bg, }}>
                        <a href={link.url} target="_blank">
                            <p className="text-base md:text-lg" style={{ color: link.color }}>
                                {link.name}
                            </p>
                        </a>
                    </section>
                ))}
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                    <footer className="flex justify-center gap-3 my-4">
                        <Social url={socialLinks.facebook}>
                            <FaFacebook size={35} color="#fff" />
                        </Social>
                        <Social url={socialLinks.youtube}>
                            <FaYoutube size={35} color="#fff" />
                        </Social>
                        <Social url={socialLinks.instagram}>
                            <FaInstagram size={35} color="#fff" />
                        </Social>
                    </footer>
                )}
            </main>
        </div>
    )
}