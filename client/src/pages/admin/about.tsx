import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AdminPanel from '@/components/admin/AdminPanel';
import AboutMeEditor from '@/components/admin/AboutMeEditor';

export default function AdminAbout() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <AdminPanel title="About Me">
      <AboutMeEditor />
    </AdminPanel>
  );
}