'use client';

import { useSession } from 'next-auth/react';

// components
import Image from 'next/image';
import Layout from './components/Layout';

export default function Home() {
  const { data: session } = useSession();
  if (!session) return;
  // console.log(session);
  let imgSrc: string = session?.user?.image as string;

  return (
    <Layout>
      <div className='text-blue-900 flex justify-between'>
        <h2>
          HELLO, <b>{session?.user?.name}</b>
        </h2>
        <div className='flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden'>
          <div className='relative w-6 h-6'>
            <Image src={imgSrc} alt='user-image' layout='fill'/>
          </div>
          <span className="px-2">
            {session?.user?.name}
          </span>
          {/* <img src="" alt="" /> */}
        </div>
      </div>
    </Layout>
  );
}
