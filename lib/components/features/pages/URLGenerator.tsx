'use client';

import React, { useState } from 'react';
import { Link } from 'lucide-react';
import type { WebsiteInfo } from '../../../services/ai/geminiApi';
import { generateAIOptimizedUrls } from '../../../services/ai/geminiApi';
import { config } from '../../../utils/config';

interface URLGeneratorProps {
  websiteInfo: WebsiteInfo;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  recentlyUpdatedFields?: Record<string, boolean>;
}

const URLGenerator: React.FC<URLGeneratorProps> = ({ websiteInfo, currentUrl, onUrlChange }) => {
  const [customUrl, setCustomUrl] = useState(currentUrl);

  const getAlternativeUrls = () => {
    if (websiteInfo.suggestedUrls?.alternatives?.length) {
      return websiteInfo.suggestedUrls.alternatives;
    }
    const aiUrls = generateAIOptimizedUrls(websiteInfo);
    return aiUrls.alternatives || [];
  };

  const handleUrlSelect = (url: string) => {
    setCustomUrl(url);
    onUrlChange(url);
  };

  return (
    <div className="url-generator">
      <div className="url-section">
        <label className="url-label">
          <Link size={14} />
          Page URL
        </label>
        
        <div className="url-input-group">
          <span className="url-prefix">{config.env.appUrl.replace(/^https?:\/\//, '')}</span>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              onUrlChange(e.target.value);
            }}
            className="url-input"
            placeholder="Enter URL slug"
          />
        </div>
      </div>

      <div className="suggested-urls">
        <h4>Suggested URLs:</h4>
        {getAlternativeUrls().map((url, index) => (
          <button
            key={index}
            onClick={() => handleUrlSelect(url)}
            className={`url-suggestion ${currentUrl === url ? 'active' : ''}`}
          >
            {url}
          </button>
        ))}
      </div>
    </div>
  );
};

export default URLGenerator;