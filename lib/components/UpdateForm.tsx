'use client';

import React, { useState } from 'react';
import { useUpdates } from '../hooks/useSupabase';
import { useFormProcessing } from '../hooks/useFormProcessing';
import ProcessingIndicator from './ui/molecules/ProcessingIndicator';

interface UpdateFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ onSuccess, onError }) => {
  const [updateText, setUpdateText] = useState('');
  const { createUpdate } = useUpdates();

  const { isProcessing, submitForm } = useFormProcessing({
    onSuccess: () => {
      setUpdateText('');
      onSuccess?.();
    },
    onError
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateText.trim()) {
      onError?.('Please enter an update');
      return;
    }

    await submitForm({ updateText }, async (data) => {
      const result = await createUpdate(data.updateText);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Error generating pages. Please try again.');
      }
    });
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
      
      <ProcessingIndicator
        isVisible={isProcessing}
        message="Generating AI-optimized pages..."
        submessage="This usually takes 30-60 seconds"
      />
    </div>
  );
};

export default UpdateForm;