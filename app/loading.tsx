import LoadingScreen from '@/lib/components/ui/templates/LoadingScreen';

// Global loading UI for the app
export default function Loading() {
  return (
    <LoadingScreen 
      size="lg" 
      text="Loading LocRaven..." 
      variant="fullscreen" 
    />
  );
}