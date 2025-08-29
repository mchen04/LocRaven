import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

interface UpdateRequest {
  updateText: string;
  startDate?: string;
  endDate?: string;
  businessProfile: any;
}

interface ProcessedUpdate {
  websiteInfo: {
    businessName: string;
    businessType: string;
    location: string;
    updateContent: string;
    temporalInfo?: {
      expiresAt?: string;
      startsAt?: string;
    };
    previewData: {
      title: string;
      description: string;
      eventDescription: string;
    };
  };
}

class SimpleUpdateProcessor {
  
  static extractTitle(content: string, businessName: string): string {
    const lowerContent = content.toLowerCase();
    const words = content.trim().split(' ');
    
    // Extract key phrases for more specific titles
    if (lowerContent.includes('grand opening') || lowerContent.includes('now open')) {
      return `${businessName} - Grand Opening`;
    }
    
    if (lowerContent.includes('sale') || lowerContent.includes('discount') || lowerContent.includes('off')) {
      // Try to extract percentage if mentioned
      const percentMatch = content.match(/(\d+)%/);
      const percent = percentMatch ? percentMatch[1] + '% ' : '';
      return `${businessName} - ${percent}Special Sale`;
    }
    
    if (lowerContent.includes('new') || lowerContent.includes('launch') || lowerContent.includes('introducing')) {
      // Try to extract what's new
      if (lowerContent.includes('menu') || lowerContent.includes('dish') || lowerContent.includes('food')) {
        return `${businessName} - New Menu Items`;
      }
      if (lowerContent.includes('service') || lowerContent.includes('offering')) {
        return `${businessName} - New Services`;
      }
      if (lowerContent.includes('product') || lowerContent.includes('item')) {
        return `${businessName} - New Products`;
      }
      return `${businessName} - New Announcement`;
    }
    
    if (lowerContent.includes('event') || lowerContent.includes('party') || lowerContent.includes('celebration')) {
      return `${businessName} - Special Event`;
    }
    
    if (lowerContent.includes('hour') || lowerContent.includes('schedule') || lowerContent.includes('closed') || lowerContent.includes('holiday')) {
      return `${businessName} - Hours Update`;
    }
    
    if (lowerContent.includes('hiring') || lowerContent.includes('job') || lowerContent.includes('position')) {
      return `${businessName} - Now Hiring`;
    }
    
    // For short updates, use first few meaningful words
    if (words.length <= 8) {
      const meaningfulWords = words.filter(word => 
        !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'].includes(word.toLowerCase())
      ).slice(0, 3);
      if (meaningfulWords.length > 0) {
        return `${businessName} - ${meaningfulWords.join(' ')}`;
      }
    }
    
    return `${businessName} - Latest Update`;
  }

  static extractDescription(content: string, businessName: string, location: string): string {
    // Clean and enhance the content for description
    const cleanContent = content.trim();
    
    // Create professional description
    if (cleanContent.length > 160) {
      return `${businessName} in ${location}: ${cleanContent.substring(0, 150)}...`;
    }
    
    return `${businessName} in ${location}: ${cleanContent}`;
  }

  static enhanceContent(content: string, businessName: string, location: string): string {
    if (!content || content.length < 5) return content;
    
    const lowerContent = content.toLowerCase();
    const cleanContent = content.trim();
    
    // More sophisticated enhancement patterns
    if (lowerContent.includes('grand opening') || lowerContent.includes('now open')) {
      return `🎉 ${businessName} is now open in ${location}! ${cleanContent} Come celebrate with us and experience what we have to offer. We can't wait to welcome you!`;
    }
    
    if (lowerContent.includes('sale') || lowerContent.includes('special') || lowerContent.includes('discount') || lowerContent.includes('off')) {
      const urgency = lowerContent.includes('limited') || lowerContent.includes('weekend') || lowerContent.includes('today') ? 
        " Don't miss out - limited time offer!" : ' Visit us soon to take advantage of this great deal!';
      return `💰 ${businessName} has an exciting offer for you: ${cleanContent} Located in ${location}, we're ready to serve you.${urgency}`;
    }
    
    if (lowerContent.includes('new menu') || lowerContent.includes('new dish') || lowerContent.includes('new food')) {
      return `🍽️ Exciting news from ${businessName}! ${cleanContent} Come taste our latest creations at our ${location} location. Our chefs can't wait for you to try something new!`;
    }
    
    if (lowerContent.includes('new') || lowerContent.includes('launch') || lowerContent.includes('introducing')) {
      return `✨ ${businessName} is thrilled to introduce: ${cleanContent} Visit us in ${location} to discover what's new and how we can better serve you!`;
    }
    
    if (lowerContent.includes('event') || lowerContent.includes('party') || lowerContent.includes('celebration')) {
      return `🎊 Join us at ${businessName} for a special event: ${cleanContent} We're located in ${location}. RSVP or contact us for more details about this exciting celebration!`;
    }
    
    if (lowerContent.includes('hour') || lowerContent.includes('schedule') || lowerContent.includes('closed') || lowerContent.includes('holiday')) {
      return `⏰ Important update from ${businessName}: ${cleanContent} We're located in ${location}. Thank you for your understanding, and we look forward to serving you!`;
    }
    
    if (lowerContent.includes('hiring') || lowerContent.includes('job') || lowerContent.includes('position')) {
      return `👥 ${businessName} is growing! ${cleanContent} Located in ${location}, we're looking for great people to join our team. Contact us to learn about opportunities!`;
    }
    
    if (lowerContent.includes('award') || lowerContent.includes('recognition') || lowerContent.includes('voted')) {
      return `🏆 We're honored to share: ${cleanContent} Thank you to our amazing customers in ${location} for your continued support of ${businessName}!`;
    }
    
    // Check if content is already well-formatted (has punctuation and good length)
    if (cleanContent.length > 50 && (cleanContent.includes('.') || cleanContent.includes('!') || cleanContent.includes('?'))) {
      return `${businessName} in ${location}: ${cleanContent} Contact us for more information!`;
    }
    
    // Default professional enhancement with more personality
    return `📢 Update from ${businessName}: ${cleanContent} We're conveniently located in ${location} and always here to serve you. Stop by or get in touch!`;
  }

  static processDates(startDate?: string, endDate?: string): any {
    const temporalInfo: any = {};
    
    if (startDate) {
      temporalInfo.startsAt = new Date(startDate + 'T00:00:00Z').toISOString();
    }
    
    if (endDate) {
      temporalInfo.expiresAt = new Date(endDate + 'T23:59:59Z').toISOString();
    }
    
    return Object.keys(temporalInfo).length > 0 ? temporalInfo : undefined;
  }

  static async processUpdate(request: UpdateRequest): Promise<ProcessedUpdate> {
    const { updateText, startDate, endDate, businessProfile } = request;
    
    const businessName = businessProfile?.name || 'Your Business';
    const businessType = businessProfile?.primary_category || 'business';
    const location = businessProfile?.address_city && businessProfile?.address_state 
      ? `${businessProfile.address_city}, ${businessProfile.address_state}` 
      : 'your location';

    // Extract and organize content
    const title = this.extractTitle(updateText, businessName);
    const description = this.extractDescription(updateText, businessName, location);
    const enhancedContent = this.enhanceContent(updateText, businessName, location);
    const temporalInfo = this.processDates(startDate, endDate);

    const websiteInfo = {
      businessName,
      businessType,
      location,
      updateContent: enhancedContent,
      temporalInfo,
      previewData: {
        title,
        description,
        eventDescription: enhancedContent
      }
    };

    return { websiteInfo };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const requestData = await req.json();
    
    if (!requestData.updateText) {
      throw new Error('Update text is required');
    }

    console.log('Processing simple update:', requestData.updateText);
    
    const result = await SimpleUpdateProcessor.processUpdate(requestData);
    
    return new Response(JSON.stringify(result), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Error processing update:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});