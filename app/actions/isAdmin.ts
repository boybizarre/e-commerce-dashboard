import NextAuth, { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

const adminEmails = ['animashaunjamal700@gmail.com'];

export const isAdminRequest = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!adminEmails.includes(session?.user?.email as string)) {
    throw 'Not an admin!';
  }
};
