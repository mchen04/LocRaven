'use client';

import React, { useState } from 'react';
import { useUpdates } from '../hooks/useSupabase';

interface UpdateFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ onSuccess, onError }) => {
  const [updateText, setUpdateText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { createUpdate } = useUpdates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateText.trim()) {
      onError?.('Please enter an update');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createUpdate(updateText);
      
      if (result.success) {
        setUpdateText('');
        onSuccess?.();
      } else {
        onError?.(result.error || 'Error generating pages. Please try again.');
      }
    } catch (error) {
      console.error('Error processing update:', error);
      onError?.('Error generating pages. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">📝 Create Business Update</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="updateText">
            What&apos;s happening at your business?
          </label>
          <textarea
            id="updateText"
            className="form-textarea"
            placeholder="Example: Happy hour 5-7pm! $5 margaritas and fresh fish tacos"
            maxLength={200}
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            required
            disabled={isProcessing}
          />
          <div className="char-count">
            <span>{updateText.length}</span> / 200
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-generate" 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>⏳ Generating...</>
          ) : (
            <>⚡ Generate AI Pages</>
          )}
        </button>
      </form>
      
      {isProcessing && (
        <div className="processing-indicator active">
          <div className="spinner"></div>
          <div className="processing-text">
            Generating AI-optimized pages...
            <br />
            <small>This usually takes 30-60 seconds</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateForm;