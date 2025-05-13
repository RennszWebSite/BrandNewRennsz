import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AdminPanel from '@/components/admin/AdminPanel';
import SocialLinksEditor from '@/components/admin/SocialLinksEditor';

export default function AdminSocialLinks() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <AdminPanel title="Social Media Links">
      <SocialLinksEditor />
    </AdminPanel>
  );
}