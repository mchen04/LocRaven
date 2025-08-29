import { supabase } from '../../utils';
import type { ConversationContext, WebsiteInfo } from './geminiApi';

export interface ProactiveAgentResponse {
  response: string;
  websiteInfo: WebsiteInfo;
  shouldShowPreview: boolean;
  completionStatus: {
    percentage: number;
    isReady: boolean;
    missingFields: string[];
    conversationStage: string;
  };
  proactiveQuestion?: string;
  agentName: string;
  confidence: number;
}

export async function callProactiveAgent(
  message: string,
  context: ConversationContext,
  businessProfile: any,
  sessionId: string
): Promise<ProactiveAgentResponse> {
  try {
    console.log('🚀 ProactiveAgentAPI: Calling production-business-agent...');
    
    // Use new Production-Grade Business Agent with enterprise features
    const { data, error } = await supabase.functions.invoke('production-business-agent', {
      body: {
        message,
        context,
        userId: context.businessProfile?.id,
        sessionId
      }
    });

    if (error) {
      console.error('❌ ProactiveAgentAPI: Edge function error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No response from proactive agent coordinator');
    }

    console.log('✅ ProactiveAgentAPI: Success:', data);
    return data;

  } catch (error) {
    console.error('💥 ProactiveAgentAPI: Error calling proactive agent:', error);
    throw error;
  }
}

// Helper function to determine if proactive agent should be used
export function shouldUseProactiveAgent(businessProfile: any, currentCompletion: number): boolean {
  // Use proactive agent if:
  // 1. Business profile exists (for data merging)
  // 2. Current completion is below 90% (needs more data)
  // 3. We have at least basic business info to work with
  
  return !!(
    businessProfile && 
    currentCompletion < 90 && 
    (businessProfile.name || businessProfile.category)
  );
}

// Configuration for proactive agent behavior
export const PROACTIVE_AGENT_CONFIG = {
  completionThreshold: 90,
  maxQuestions: 6,
  questionStrategy: 'adaptive' as const,
  timeoutMs: 10000,
  retryAttempts: 3,
  fallbackToStandard: true
};