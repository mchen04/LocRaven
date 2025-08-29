'use client';

import React, { useState } from 'react';
import { Header, StatsCards, UpdateForm, Alert, AlertType } from '../components';
import { BusinessProfileView } from './features/business';
import { PagesList } from './features/pages';
import { usePages, useUpdates, useStats } from '../hooks';

const Dashboard: React.FC = () => {
  const { pages, deletePage, refreshPages } = usePages();
  const { updates } = useUpdates();
  const stats = useStats(pages, updates);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);


  const handleUpdateSuccess = async () => {
    setAlert({ 
      type: 'success', 
      message: 'Successfully generated AI-optimized pages!' 
    });
    await refreshPages();
  };

  const handleUpdateError = (error: string) => {
    setAlert({ type: 'error', message: error });
  };

  const handleDeletePage = async (pageId: string) => {
    const result = await deletePage(pageId);
    if (result.success) {
      setAlert({ type: 'success', message: 'Page deleted successfully' });
    } else {
      setAlert({ type: 'error', message: result.error || 'Error deleting page' });
    }
  };

  return (
    <>
      <Header />
      
      <main className="dashboard-content">
        <div className="container">
          <StatsCards 
            totalPages={stats.totalPages}
            updatesToday={stats.updatesToday}
            activePages={stats.activePages}
          />

          {alert && (
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert(null)} 
            />
          )}

          <BusinessProfileView />

          <div className="dashboard-grid">
            <UpdateForm 
              onSuccess={handleUpdateSuccess}
              onError={handleUpdateError}
            />
            
            <PagesList 
              pages={pages} 
              onDeletePage={handleDeletePage}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;