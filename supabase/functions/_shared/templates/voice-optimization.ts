/**
 * Voice Search Optimization Helpers
 * Optimized for Alexa, Google Assistant, Siri, and AI chatbots
 */

import { PageData, isOpenNow, getClosingTime, getCategoryDisplay } from './base-template.ts';

// Generate voice-optimized content blocks for different query types
export function generateVoiceContent(data: PageData, queryType: 'hours' | 'location' | 'services' | 'contact' | 'general'): string {
  switch (queryType) {
    case 'hours':
      return generateHoursResponse(data);
    case 'location':
      return generateLocationResponse(data);
    case 'services':
      return generateServicesResponse(data);
    case 'contact':
      return generateContactResponse(data);
    default:
      return generateGeneralResponse(data);
  }
}

// Voice response for "What are the hours for [business]?"
function generateHoursResponse(data: PageData): string {
  const isOpen = isOpenNow(data);
  const closing = getClosingTime(data);
  
  if (data.business.status_override) {
    switch (data.business.status_override) {
      case 'closed_emergency':
        return `${data.business.name} is temporarily closed due to an emergency. Please check back later.`;
      case 'closed_holiday':
        return `${data.business.name} is closed today for a holiday. Regular hours will resume tomorrow.`;
      case 'temporarily_closed':
        return `${data.business.name} is temporarily closed. Please call ${data.business.phone || 'them'} for updates.`;
    }
  }

  if (isOpen) {
    return `${data.business.name} is open now until ${closing}. They're located in ${data.business.address_city}, ${data.business.address_state}.`;
  } else {
    return `${data.business.name} is currently closed. They're located in ${data.business.address_city}, ${data.business.address_state}. ${data.business.phone ? `You can call ${data.business.phone} for hours.` : ''}`;
  }
}

// Voice response for "Where is [business] located?"
function generateLocationResponse(data: PageData): string {
  const parts = [
    `${data.business.name} is located`,
    data.business.address_street ? `at ${data.business.address_street}` : '',
    `in ${data.business.address_city}, ${data.business.address_state}`
  ].filter(Boolean);

  let response = parts.join(' ') + '.';

  if (data.business.service_area_details?.primary_city && 
      data.business.service_area_details.primary_city !== data.business.address_city) {
    response += ` They also serve the ${data.business.service_area_details.primary_city} area.`;
  }

  if (data.business.phone) {
    response += ` You can call them at ${formatPhoneForVoice(data.business.phone)}.`;
  }

  return response;
}

// Voice response for "What services does [business] offer?"
function generateServicesResponse(data: PageData): string {
  const category = getCategoryDisplay(data.business.primary_category);
  let response = `${data.business.name} is a ${category.toLowerCase()} business`;

  if (data.business.services && data.business.services.length > 0) {
    const services = data.business.services.slice(0, 3);
    response += ` offering ${services.join(', ')}`;
  }

  if (data.business.specialties && data.business.specialties.length > 0) {
    const specialties = data.business.specialties.slice(0, 2);
    response += `. They specialize in ${specialties.join(' and ')}.`;
  } else {
    response += '.';
  }

  if (data.update.content_text.length < 100) {
    response += ` Currently, ${data.update.content_text}`;
  }

  return response;
}

// Voice response for "How can I contact [business]?"
function generateContactResponse(data: PageData): string {
  let response = `To contact ${data.business.name}`;

  const contactMethods = [];
  
  if (data.business.phone) {
    contactMethods.push(`call ${formatPhoneForVoice(data.business.phone)}`);
  }

  if (data.business.website) {
    contactMethods.push(`visit their website`);
  }

  if (data.business.email) {
    contactMethods.push('send them an email');
  }

  if (contactMethods.length > 0) {
    response += `, you can ${contactMethods.join(' or ')}.`;
  }

  response += ` They're located in ${data.business.address_city}, ${data.business.address_state}`;
  
  if (isOpenNow(data)) {
    response += ` and are open now until ${getClosingTime(data)}.`;
  } else {
    response += ` and are currently closed.`;
  }

  return response;
}

// General voice response for business queries
function generateGeneralResponse(data: PageData): string {
  const category = getCategoryDisplay(data.business.primary_category);
  const isOpen = isOpenNow(data);
  
  let response = `${data.business.name} is a ${category.toLowerCase()} business in ${data.business.address_city}, ${data.business.address_state}.`;

  if (isOpen) {
    response += ` They are open now until ${getClosingTime(data)}.`;
  } else {
    response += ` They are currently closed.`;
  }

  // Add current update if it's brief
  if (data.update.content_text.length < 80) {
    response += ` ${data.update.content_text}`;
  }

  if (data.business.phone) {
    response += ` You can call them at ${formatPhoneForVoice(data.business.phone)}.`;
  }

  return response;
}

// Generate FAQs optimized for voice queries
export function generateVoiceFAQs(data: PageData): Array<{question: string, answer: string, triggers: string[]}> {
  const voiceFAQs: Array<{question: string, answer: string, triggers: string[]}> = [];

  // Hours FAQ
  voiceFAQs.push({
    question: `What are ${data.business.name}'s hours?`,
    answer: generateHoursResponse(data),
    triggers: ['hours', 'open', 'close', 'what time', 'when do you']
  });

  // Location FAQ
  voiceFAQs.push({
    question: `Where is ${data.business.name} located?`,
    answer: generateLocationResponse(data),
    triggers: ['where', 'location', 'address', 'find you', 'near me']
  });

  // Contact FAQ
  voiceFAQs.push({
    question: `How can I contact ${data.business.name}?`,
    answer: generateContactResponse(data),
    triggers: ['contact', 'phone number', 'call', 'reach you', 'get in touch']
  });

  // Services FAQ
  if (data.business.services && data.business.services.length > 0) {
    voiceFAQs.push({
      question: `What services does ${data.business.name} offer?`,
      answer: generateServicesResponse(data),
      triggers: ['services', 'do you offer', 'what do you do', 'help with']
    });
  }

  // Current update FAQ
  if (data.update.content_text.length > 20) {
    voiceFAQs.push({
      question: `What's new at ${data.business.name}?`,
      answer: `${data.update.content_text} ${data.business.phone ? `Call ${formatPhoneForVoice(data.business.phone)} for details.` : ''}`,
      triggers: ['whats new', 'current offers', 'specials', 'deals', 'updates']
    });
  }

  // Add existing business FAQs with voice optimization
  if (data.business.business_faqs) {
    data.business.business_faqs.forEach((faq: any) => {
      if (faq.question && faq.answer) {
        voiceFAQs.push({
          question: faq.question,
          answer: optimizeAnswerForVoice(faq.answer),
          triggers: faq.voiceSearchTriggers || extractKeywordsFromQuestion(faq.question)
        });
      }
    });
  }

  return voiceFAQs.slice(0, 8); // Limit to most important FAQs
}

// Generate speakable markup for HTML
export function generateSpeakableMarkup(data: PageData): string {
  const generalResponse = generateGeneralResponse(data);
  const hoursResponse = generateHoursResponse(data);
  const contactResponse = generateContactResponse(data);

  return `
    <!-- Speakable Content for Voice Assistants -->
    <div class="speakable-content" style="display: none;" aria-hidden="true">
      <div class="speakable" data-speakable="general">
        ${generalResponse}
      </div>
      
      <div class="speakable" data-speakable="hours">
        ${hoursResponse}
      </div>
      
      <div class="speakable" data-speakable="contact">
        ${contactResponse}
      </div>
      
      ${data.business.services ? `
      <div class="speakable" data-speakable="services">
        ${generateServicesResponse(data)}
      </div>
      ` : ''}
    </div>
  `;
}

// Generate voice search triggers for different intent types
export function generateVoiceTriggersForIntent(data: PageData, intentType: string): string[] {
  const baseTriggers = [
    data.business.name.toLowerCase(),
    `${data.business.name.toLowerCase()} ${data.business.address_city.toLowerCase()}`,
    getCategoryDisplay(data.business.primary_category).toLowerCase()
  ];

  const intentTriggers: Record<string, string[]> = {
    'direct': [
      `${data.business.name.toLowerCase()} deals`,
      `${data.business.name.toLowerCase()} specials`,
      `${data.business.name.toLowerCase()} offers`,
      `${data.business.name.toLowerCase()} hours`,
      `${data.business.name.toLowerCase()} phone`
    ],
    'local': [
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} near me`,
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} in ${data.business.address_city.toLowerCase()}`,
      `best ${getCategoryDisplay(data.business.primary_category).toLowerCase()} ${data.business.address_city.toLowerCase()}`,
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} open now`,
      'food near me',
      'restaurants near me'
    ],
    'category': [
      `professional ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} services`,
      `best ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `expert ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`
    ],
    'service-urgent': [
      `emergency ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `urgent ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `immediate ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} available now`,
      'open late tonight',
      'available right now'
    ],
    'competitive': [
      `best ${getCategoryDisplay(data.business.primary_category).toLowerCase()} in ${data.business.address_city.toLowerCase()}`,
      `top ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`,
      `${getCategoryDisplay(data.business.primary_category).toLowerCase()} reviews`,
      `compare ${getCategoryDisplay(data.business.primary_category).toLowerCase()}`
    ]
  };

  return [...baseTriggers, ...(intentTriggers[intentType] || [])];
}

// Helper functions
function formatPhoneForVoice(phone: string): string {
  // Format phone number for voice pronunciation
  // "2065550100" becomes "2-0-6-5-5-5-0-1-0-0"
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    // US phone number: (206) 555-0100
    return `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US phone with country code: 1-206-555-0100
    return `1 ${cleaned.slice(1,4)} ${cleaned.slice(4,7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Return as-is if not standard format
}

function optimizeAnswerForVoice(answer: string): string {
  // Optimize text answer for voice assistants
  let optimized = answer;
  
  // Keep answers under 50 words for voice
  const words = optimized.split(' ');
  if (words.length > 50) {
    optimized = words.slice(0, 45).join(' ') + '...';
  }
  
  // Replace common abbreviations
  optimized = optimized.replace(/\b&\b/g, 'and');
  optimized = optimized.replace(/\bw\//g, 'with ');
  optimized = optimized.replace(/\b@\b/g, 'at ');
  
  return optimized;
}

function extractKeywordsFromQuestion(question: string): string[] {
  // Extract key phrases from FAQ questions for voice triggers
  const words = question.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && 
            !['the', 'and', 'for', 'are', 'you', 'can', 'how', 'what', 'where', 'when', 'why', 'does', 'will'].includes(word));
  
  return words.slice(0, 3);
}