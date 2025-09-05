import { PropsWithChildren } from 'react';

export default function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to LocRaven!</h1>
          <p className="text-gray-400">Let&apos;s set up your business profile to get started</p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-black rounded-full font-semibold">
                1
              </div>
              <span className="text-sm text-gray-400">Business Profile Setup</span>
            </div>
            <div className="w-16 h-px bg-gray-700 mx-4"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-700 text-gray-400 rounded-full font-semibold">
                2
              </div>
              <span className="text-sm text-gray-400">Generate Your Page</span>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}