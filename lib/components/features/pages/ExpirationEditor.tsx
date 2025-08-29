'use client';

import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { TemporalInfo } from '../../../services/ai/geminiApi';

interface ExpirationEditorProps {
  temporalInfo?: TemporalInfo;
  onUpdate: (temporalInfo: TemporalInfo) => void;
}

const ExpirationEditor: React.FC<ExpirationEditorProps> = ({ temporalInfo, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState<TemporalInfo>(temporalInfo || {});

  const handleSave = () => {
    onUpdate(tempData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempData(temporalInfo || {});
    setEditMode(false);
  };

  const formatExpirationDisplay = () => {
    if (!temporalInfo?.expiresAt) {
      return 'No expiration set';
    }
    
    const expDate = new Date(temporalInfo.expiresAt);
    const now = new Date();
    const timeDiff = expDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return `Expired ${Math.abs(daysDiff)} day(s) ago`;
    } else if (daysDiff === 0) {
      return 'Expires today';
    } else if (daysDiff === 1) {
      return 'Expires tomorrow';
    } else {
      return `Expires in ${daysDiff} days (${expDate.toLocaleDateString()})`;
    }
  };

  const getExpirationColor = () => {
    if (!temporalInfo?.expiresAt) return '#6b7280';
    
    const expDate = new Date(temporalInfo.expiresAt);
    const now = new Date();
    const timeDiff = expDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return '#ef4444'; // Red for expired
    if (daysDiff <= 1) return '#f59e0b'; // Orange for soon
    if (daysDiff <= 3) return '#10b981'; // Green for active
    return '#6b7280'; // Gray for future
  };

  const getStatusIcon = () => {
    if (!temporalInfo?.expiresAt) return <Clock size={14} style={{ color: '#6b7280' }} />;
    
    const expDate = new Date(temporalInfo.expiresAt);
    const now = new Date();
    const timeDiff = expDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return <AlertTriangle size={14} style={{ color: '#ef4444' }} />;
    if (daysDiff <= 1) return <AlertTriangle size={14} style={{ color: '#f59e0b' }} />;
    return <CheckCircle size={14} style={{ color: '#10b981' }} />;
  };

  if (!editMode) {
    return (
      <div className="expiration-display" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        border: '0.0625rem solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {getStatusIcon()}
          <span style={{
            fontSize: '0.75rem',
            color: getExpirationColor(),
            fontWeight: '500'
          }}>
            {formatExpirationDisplay()}
          </span>
        </div>
        
        <button
          onClick={() => setEditMode(true)}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#f3f4f6',
            border: '0.0625rem solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.6875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Calendar size={12} />
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="expiration-editor" style={{
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      border: '0.0625rem solid rgba(59, 130, 246, 0.2)'
    }}>
      <div style={{
        fontSize: '0.8125rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '0.75rem'
      }}>
        📅 Set Expiration Details
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        {/* Date Input */}
        <div>
          <label style={{
            fontSize: '0.6875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.25rem',
            display: 'block'
          }}>
            Expiration Date:
          </label>
          <input
            type="date"
            value={tempData.expiresAt ? new Date(tempData.expiresAt).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                const selectedDate = new Date(e.target.value);
                selectedDate.setHours(23, 59, 59); // End of day
                setTempData(prev => ({
                  ...prev,
                  expiresAt: selectedDate.toISOString()
                }));
              } else {
                setTempData(prev => ({
                  ...prev,
                  expiresAt: undefined
                }));
              }
            }}
            style={{
              width: '100%',
              padding: '0.375rem 0.5rem',
              border: '0.0625rem solid #374151',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              backgroundColor: '#1f2937',
              color: '#e5e7eb'
            }}
          />
        </div>

        {/* Time Input */}
        <div>
          <label style={{
            fontSize: '0.6875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.25rem',
            display: 'block'
          }}>
            End Time:
          </label>
          <input
            type="time"
            value={tempData.endTime || ''}
            onChange={(e) => setTempData(prev => ({
              ...prev,
              endTime: e.target.value
            }))}
            style={{
              width: '100%',
              padding: '0.375rem 0.5rem',
              border: '0.0625rem solid #374151',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              backgroundColor: '#1f2937',
              color: '#e5e7eb'
            }}
          />
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'Today', hours: 0 },
          { label: 'Tomorrow', hours: 24 },
          { label: 'This Weekend', hours: 72 },
          { label: '1 Week', hours: 168 }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              const expDate = new Date(Date.now() + preset.hours * 60 * 60 * 1000);
              setTempData(prev => ({
                ...prev,
                expiresAt: expDate.toISOString(),
                date: preset.label.toLowerCase()
              }));
            }}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#f9fafb',
              border: '0.0625rem solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.6875rem',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Deal Terms */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          fontSize: '0.6875rem',
          fontWeight: '500',
          color: '#d1d5db',
          marginBottom: '0.25rem',
          display: 'block'
        }}>
          Deal Terms (Optional):
        </label>
        <input
          type="text"
          value={tempData.dealTerms || ''}
          onChange={(e) => setTempData(prev => ({
            ...prev,
            dealTerms: e.target.value
          }))}
          placeholder="e.g., 20% off, buy one get one, limited quantities"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '0.0625rem solid #374151',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            backgroundColor: '#1f2937',
            color: '#e5e7eb'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#f3f4f6',
            border: '0.0625rem solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ExpirationEditor;