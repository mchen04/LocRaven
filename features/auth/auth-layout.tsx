import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 py-8 sm:w-[480px] sm:p-8'>
        <div className='flex flex-col items-center text-center space-y-2'>
          <div className='flex items-center'>
            <Logo className='me-2' />
            <h1 className='text-2xl font-bold'>LocRaven</h1>
          </div>
          <p className='text-muted-foreground text-sm max-w-md'>
            AI-Discoverable Business Updates in 60 Seconds
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
