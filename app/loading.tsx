import { Loading } from '@/lib/components/ui/atoms';

// Global loading UI for the app
export default function AppLoading() {
  return (
    <Loading 
      size="lg" 
      text="Loading LocRaven..." 
      layout="fullscreen" 
    />
  );
}