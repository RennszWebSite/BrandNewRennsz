import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AdminPanel from '@/components/admin/AdminPanel';
import ChannelSwitcher from '@/components/admin/ChannelSwitcher';

export default function AdminChannel() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <AdminPanel title="Channel Management">
      <div className="max-w-md mx-auto">
        <ChannelSwitcher />
      </div>
    </AdminPanel>
  );
}