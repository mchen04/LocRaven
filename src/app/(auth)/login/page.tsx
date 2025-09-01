import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getSubscription } from '@/features/account/controllers/get-subscription';

import { signInWithEmail, signInWithOAuth } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function LoginPage() {
  const user = await getAuthUser();
  const subscription = await getSubscription();

  if (user && subscription) {
    redirect('/dashboard');
  }

  if (user && !subscription) {
    redirect('/pricing');
  }

  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <AuthUI mode='login' signInWithOAuth={signInWithOAuth} signInWithEmail={signInWithEmail} />
    </section>
  );
}
