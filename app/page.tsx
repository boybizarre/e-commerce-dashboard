'use client';

import { useSession } from 'next-auth/react';

// components
import Image from 'next/image';
import Layout from './components/Layout';

export default function Home({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  // console.log(session);
  let imgSrc: string = session?.user?.image as string;

  if (!session) {
    return <Layout>{children}</Layout>;
  } else {
    return (
      <Layout>
        <div className='text-blue-900 flex justify-between'>
          <h2>
            HELLO, <b>{session?.user?.name}</b>
          </h2>
          <div className='flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden'>
            <div className='relative w-6 h-6'>
              <Image src={imgSrc} alt='user-image' layout='fill' />
            </div>
            <span className='px-2'>{session?.user?.name}</span>
            {/* <img src="" alt="" /> */}
          </div>
        </div>
      </Layout>
    );
  }
}
