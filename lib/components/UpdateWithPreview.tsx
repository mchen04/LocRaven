'use client';

import React, { useState } from 'react';
import EnhancedUpdateForm, { UpdateFormData } from './EnhancedUpdateForm';
import { PagePreview } from './features/pages';
import { useBusiness } from '../contexts/BusinessContext';
import { supabase } from '../utils/supabase';
import type { WebsiteInfo } from '../services';
import '../styles/EnhancedUpdateForm.css';
import '../styles/UpdateWithPreview.css';


interface UpdateWithPreviewProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const UpdateWithPreview: React.FC<UpdateWithPreviewProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { business } = useBusiness();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<WebsiteInfo | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFormSubmit = async (formData: UpdateFormData) => {
    if (!business?.id) {
      onError?.('Please set up your business profile first');
      return;
    }

    setIsProcessing(true);

    try {
      // Call enhanced createUpdate function with timing data
      const result = await createUpdateWithTiming(
        formData.description,
        formData.goLiveAt,
        formData.expiresAt
      );

      if (result.success) {
        // Convert the result to WebsiteInfo format for preview
        const websiteInfo: WebsiteInfo = {
          businessName: business.name || 'Your Business',
          businessType: business.primary_category || 'business',
          location: business.address_city && business.address_state 
            ? `${business.address_city}, ${business.address_state}` 
            : business.address_city || 'Your Location',
          updateContent: formData.description,
          temporalInfo: {
            expiresAt: formData.expiresAt?.toISOString() || undefined
          },
          contactInfo: {
            phone: business.phone || '',
            email: business.email || ''
          },
          // AI-generated content will be handled by the Edge Function
        };

        setPreviewData(websiteInfo);
        setShowPreview(true);
        
        onSuccess?.();
      } else {
        onError?.(result.error || 'Failed to generate preview');
      }
    } catch (error) {
      console.error('Error processing update:', error);
      onError?.('Error generating preview. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced createUpdate function that includes timing data
  const createUpdateWithTiming = async (
    contentText: string,
    goLiveAt: Date | null,
    expiresAt: Date | null
  ) => {
    try {
      const { data: update, error: updateError } = await supabase
        .from('updates')
        .insert({
          business_id: business!.id,
          content_text: contentText,
          expiration_date_time: expiresAt?.toISOString() || null,
          status: 'pending' as const
        })
        .select()
        .single();

      if (updateError) throw updateError;

      // Call enhanced Edge Function with timing data
      const { data: result, error: processError } = await supabase.functions
        .invoke('process-update-with-template', {
          body: {
            updateId: update.id,
            businessId: business!.id,
            contentText: contentText,
            temporalInfo: {
              updateCategory: 'general',
              expiresAt: expiresAt?.toISOString() || null
            }
          }
        });

      if (processError) throw processError;

      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create update' };
    }
  };


  const handlePreviewEdit = (field: string, value: string) => {
    if (!previewData) return;
    
    const updatedData = { ...previewData };
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentObj = (updatedData as any)[parent] || {};
      (updatedData as any)[parent] = { ...parentObj, [child]: value };
    } else {
      (updatedData as any)[field] = value;
    }
    
    setPreviewData(updatedData);
  };

  const handleFinalPublish = async (finalData: WebsiteInfo) => {
    // This would trigger the actual page generation and publication
    console.log('Publishing final data:', finalData);
    onSuccess?.();
  };

  const handleBackToForm = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // supabase is now imported at the top of the file

  return (
    <div className="update-with-preview">
      {/* Enhanced Form Section */}
      <div className="form-section">
        <EnhancedUpdateForm
          onSubmit={handleFormSubmit}
          onError={onError}
          isProcessing={isProcessing}
        />
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        {showPreview && previewData ? (
          <PagePreview
            websiteInfo={previewData}
            onEdit={handlePreviewEdit}
            onConfirm={handleFinalPublish as any}
            showActions={true}
            completionStatus={{
              percentage: 100,
              isReady: true,
              missingFields: []
            }}
            onBackToForm={handleBackToForm}
          />
        ) : (
          <div className="preview-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🚀</div>
              <h3>AI Multi-Page Preview</h3>
              <p>Fill out your update details and click "Generate Preview" to see your AI-optimized pages.</p>
              <div className="preview-features">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>3 targeting strategies</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤖</span>
                  <span>AI-optimized content</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌍</span>
                  <span>GEO-targeted results</span>
                </div>
              </div>
              
              {isProcessing && (
                <div className="preview-processing">
                  <div className="spinner" />
                  <span>Generating 3 AI-optimized pages...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateWithPreview;