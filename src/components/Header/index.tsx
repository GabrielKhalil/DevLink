import { BiLogOut } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useEffect, useState } from 'react';

export function Header() {

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

    async function handleLogout() {
        signOut(auth);
    }

    return (
        <header className='w-full max-w-2xl mt-4 px-1'>
            <nav className='w-full bg-white h-12 flex items-center justify-between rounded-md px-3'>
                <div className='flex gap-4 font-medium'>
                    <Link to={`/home/user/NHwCcTV0DwcBUMhuzKqQfahvxBY2`}>
                        Home
                    </Link>
                    <Link to='/admin'>
                        Links
                    </Link>
                    <Link to='/admin/social'>
                        Redes sociais
                    </Link>
                </div>

                <button onClick={handleLogout}>
                    <BiLogOut size={28} color='#db2629' />
                </button>
            </nav>
        </header>
    )
}