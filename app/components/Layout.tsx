'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

// components
import Nav from './Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='bg-blue-900 w-screen h-screen flex items-center'>
        <div className='text-center w-full'>
          <button
            onClick={() => signIn('google')}
            className='bg-white py-2 px-4 rounded-lg'
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-blue-900 min-h-screen flex'>
      <Nav />
      <div className='bg-white grow my-2 mr-2 rounded-lg p-4'>{children}</div>
      {/* <button onClick={() => signOut()} className='px-3 bg-red-500 rounded-md'>
        Sign Out
      </button> */}
    </div>
  );
}
