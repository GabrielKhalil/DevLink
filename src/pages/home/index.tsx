import { Social } from "../../components/Social"
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { db } from '../../services/firebaseConnection'
import { getDocs, collection, orderBy, query, doc, getDoc } from "firebase/firestore"
import { useEffect, useState, } from "react"
import { useParams } from "react-router-dom"


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
            const docRef = doc(db, 'social', 'link')
            getDoc(docRef)
                .then((snapshot) => {
                    if (snapshot.data() !== undefined) {
                        setSocialLinks({
                            facebook: snapshot.data()?.facebook,
                            instagram: snapshot.data()?.instagram,
                            youtube: snapshot.data()?.youtube,
                            userId: snapshot.data()?.userId
                        })
                    }
                })
        }

        loadSocialLinks();
    }, [])

    const filteredLinks = links.filter(links => links.userId === uid);
    // Assuming socialLinks is an array of social link objects
    // const filteredSocialLinks = {
    //     facebook: socialLinks?.facebook || '',
    //     youtube: socialLinks?.youtube || '',
    //     instagram: socialLinks?.instagram || '',
    //     userId: socialLinks?.userId || ''
    // };
    // const filtroSocial = filteredLinks.filter(filteredLinks => filteredLinks.userId === currentUser);





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
                        <Social url="https://www.facebook.com/?locale=pt_BR">
                            <FaFacebook size={35} color="#fff" />
                        </Social>

                        <Social url="https://www.youtube.com/">
                            <FaYoutube size={35} color="#fff" />
                        </Social>

                        <Social url="https://www.instagram.com/">
                            <FaInstagram size={35} color="#fff" />
                        </Social>
                    </footer>
                )}
            </main>
        </div>
    )
}