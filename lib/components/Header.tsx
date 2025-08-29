'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { signOut } = useAuth();
  const { business } = useBusiness();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">🦅 LocRaven</Link>
          <div className="user-menu">
            <span className="business-name">
              {business?.name || 'Loading...'}
            </span>
            <button className="btn-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;