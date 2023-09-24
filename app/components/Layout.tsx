'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

// components
import Nav from './Nav';
import Logo from './Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='bg-bgGray w-screen h-screen flex items-center'>
        <div className='text-center w-full'>
          <button
            onClick={() => signIn('google')}
            className='btn-primary py-2 px-4'
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-bgGray min-h-screen'>
      <div className='flex items-center md:hidden p-4 '>
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </button>
        <div className='flex grow justify-center mr-6'>
          <Logo />
        </div>
      </div>
      <div className='flex'>
        <Nav show={showNav} />
        <div className=' grow p-4'>{children}</div>
        {/* <button onClick={() => signOut()} className='px-3 bg-red-500 rounded-md'>
          Sign Out
        </button> */}
      </div>
    </div>
  );
}
