'use client';

import React, { useState } from 'react';
import { Header, StatsCards, UpdateForm } from '../components';
import { BusinessProfileView } from './features/business';
import { PagesList } from './features/pages';
import { usePages, useUpdates, useStats } from '../hooks';
import FormError from './ui/molecules/FormError';

const Dashboard: React.FC = () => {
  const { pages, deletePage, refreshPages } = usePages();
  const { updates } = useUpdates();
  const stats = useStats(pages, updates);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


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

          {alert && alert.type === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <FormError 
                  error={alert.message} 
                  variant="inline"
                  className="flex-1"
                />
                <button
                  onClick={() => setAlert(null)}
                  className="text-red-400 hover:text-red-600 ml-3"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {alert && alert.type === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-green-400 mr-3">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">{alert.message}</p>
                </div>
                <button
                  onClick={() => setAlert(null)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
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