import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse,
  generateAIOptimizedContent,
  generateIntentBasedURL
} from '../_shared/utils.ts'
import { 
  createPageData, 
  estimateRenderedSize, 
  compressPageData
} from '../_shared/simple-template-engine.ts'

// AI FAQ optimization imports
interface AIOptimizedFAQ {
  question: string;
  answer: string;
  category: string;
  priority: number;
  voiceSearchTriggers: string[];
  aiSearchRelevance: string;
  characterCount: number;
}

// Template-based page generator using the professional template
serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { updateId, temporalInfo, specialHours, faqData } = await safeJsonParse(req);
    console.log('Edge Function called with:', { updateId });
    
    const supabase = createSupabaseClient();

    const startTime = Date.now()
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(updateId)) {
      console.error('Invalid UUID format for updateId:', updateId);
      throw new Error(`Invalid UUID format for updateId: ${updateId}`);
    }
    
    // Use RPC to bypass RLS policies for service role operations
    const { error: updateError } = await supabase.rpc('update_business_update_status', {
      update_id: updateId,
      new_status: 'processing',
      special_hours: specialHours ? JSON.stringify(specialHours) : null,
      deal_terms_param: temporalInfo?.dealTerms || null,
      expiration_time: temporalInfo?.expiresAt || null,
      category: temporalInfo?.updateCategory || 'general'
    });

    if (updateError) {
      console.error('Error updating status:', updateError);
      throw new Error(`Failed to update status: ${updateError.message}`);
    }

    // Get update details first to get business_id
    const { data: updateRecord } = await supabase
      .from('updates')
      .select('*, businesses(*)')
      .eq('id', updateId)
      .single()

    if (!updateRecord) {
      throw new Error('Update not found')
    }

    const business = updateRecord.businesses
    if (!business) {
      throw new Error('Business not found')
    }

    // Use the actual business_id and content from the update record
    const businessId = business.id
    const contentText = updateRecord.content_text

    // Generate batch ID for coordinated multi-page lifecycle
    const batchId = crypto.randomUUID();
    
    // Generate 6 AI-optimized pages with different search intents
    const intentTypes: ('direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive')[] = 
      ['direct', 'local', 'category', 'branded-local', 'service-urgent', 'competitive'];
    const aiProvider = business.ai_provider || 'gemini';
    
    // Generate all 6 pages in parallel for maximum efficiency
    const pageGenerationPromises = intentTypes.map(async (intentType) => {
      try {
        console.log(`Generating ${intentType} content for business: ${business.name}`);
        
        // Generate AI-optimized content for this intent
        const { title, description, slug: aiSlug } = await generateAIOptimizedContent(
          business, 
          {
            content_text: contentText,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }, 
          intentType, 
          aiProvider
        );
        
        console.log(`Successfully generated ${intentType} content:`, { 
          title: title.substring(0, 50), 
          description: description.substring(0, 50),
          aiSlug: aiSlug?.substring(0, 30) || 'none'
        });
        
        // Generate intent-specific URL structure using AI-generated slug
        const { filePath, slug, pageVariant } = generateIntentBasedURL(
          business,
          { content_text: contentText },
          intentType,
          updateId,
          aiSlug
        );
        
        // Create page data for template system
        const updateData = {
          content_text: contentText,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };

        const pageData = createPageData(
          business,
          updateData,
          { title, description },
          { type: intentType, filePath, slug, pageVariant }
        );

        const compressedData = compressPageData(pageData);
        const estimatedSize = estimateRenderedSize(pageData);
        
        return {
          update_id: updateId,
          business_id: businessId,
          file_path: filePath,
          title: title,
          template_id: intentType,
          page_data: compressedData,
          rendered_size_kb: estimatedSize,
          content_intent: 'update',
          slug: slug,
          page_type: 'update',
          intent_type: intentType,
          page_variant: pageVariant,
          generation_batch_id: batchId,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          // Keep HTML for backward compatibility during migration
          html_content: null
        };
        
      } catch (error) {
        console.error(`Error generating ${intentType} page:`, error);
        
        // Fallback: generate basic page if AI fails (no AI slug available)
        const { filePath, slug, pageVariant } = generateIntentBasedURL(
          business,
          { content_text: contentText },
          intentType,
          updateId,
          undefined // No AI slug in fallback case
        );
        
        const fallbackTitle = `${business.name} - Update - ${business.address_city}, ${business.address_state}`;
        const fallbackUpdateData = {
          content_text: contentText,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };

        const fallbackPageData = createPageData(
          business,
          fallbackUpdateData,
          { title: fallbackTitle, description: contentText },
          { type: intentType, filePath, slug, pageVariant }
        );
        
        return {
          update_id: updateId,
          business_id: businessId,
          file_path: filePath,
          title: fallbackTitle,
          template_id: intentType,
          page_data: compressPageData(fallbackPageData),
          rendered_size_kb: estimateRenderedSize(fallbackPageData),
          content_intent: 'update',
          slug: slug,
          page_type: 'update',
          intent_type: intentType,
          page_variant: pageVariant,
          generation_batch_id: batchId,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
    });
    
    // Wait for all pages to be generated
    const pageData = await Promise.all(pageGenerationPromises);
    
    const processingTime = Date.now() - startTime

    // Store generated pages as drafts (unpublished)
    const { data: insertedPages, error: insertError } = await supabase
      .from('generated_pages')
      .insert(pageData.map(page => ({
        ...page,
        published: false,  // Store as draft
        published_at: null
      })))
      .select();

    if (insertError) {
      console.error('Error inserting draft pages:', insertError);
      throw new Error(`Failed to save draft pages: ${insertError.message}`);
    }

    // Update status to ready-for-preview instead of completed
    const { error: finalUpdateError } = await supabase.rpc('update_business_update_status', {
      update_id: updateId,
      new_status: 'ready-for-preview',
      processing_time: processingTime
    });

    if (finalUpdateError) {
      console.error('Error updating final status:', finalUpdateError);
      // Don't throw here as pages were successfully generated
    }

    // Increment usage tracking for this business (using same direct query pattern)
    try {
      // Calculate current month boundaries
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);
      
      // Get current usage and increment (direct query pattern)
      const { data: currentUsage } = await supabase
        .from('business_usage_tracking')
        .select('updates_used')
        .eq('business_id', businessId)
        .eq('usage_period_start', currentMonthStart.toISOString())
        .single();

      if (currentUsage) {
        // Increment usage count
        await supabase
          .from('business_usage_tracking')
          .update({ 
            updates_used: currentUsage.updates_used + 1,
            updated_at: new Date().toISOString()
          })
          .eq('business_id', businessId)
          .eq('usage_period_start', currentMonthStart.toISOString());
      }
    } catch (error) {
      console.error('Error updating usage tracking:', error);
      // Don't fail the entire operation if usage tracking fails
    }

    // Return page data for preview and publishing
    return successResponse({
      pages: insertedPages?.map(page => ({
        id: page.id,
        url: page.file_path,
        title: page.title,
        intent_type: page.intent_type,
        page_variant: page.page_variant,
        template_id: page.template_id,
        data_size_bytes: JSON.stringify(page.page_data).length,
        estimated_html_size_kb: page.rendered_size_kb,
        slug: page.slug,
        expires_at: page.expires_at,
        published: page.published,
        previewUrl: `/preview/${page.id}`
      })) || [],
      batch_id: batchId,
      total_pages: insertedPages?.length || 0,
      processingTime,
      previewMode: true,
      message: 'Pages generated as drafts. Use publish-pages function to make them live.'
    })
  } catch (error) {
    console.error('Error processing update with template:', error)
    
    const supabase = createSupabaseClient()
    
    const { updateId } = await req.json().catch(() => ({}))
    if (updateId) {
      await supabase.rpc('update_business_update_status', {
        update_id: updateId,
        new_status: 'failed',
        error_msg: error.message
      });
    }
    
    return errorResponse(error.message)
  }
})

// AI-Native Business Update HTML Generator  
function generateAINativeBusinessUpdateHtml(
  business: any, 
  updateData: any, 
  filePath: string, 
  optimizedTitle?: string, 
  optimizedDescription?: string,
  intentType?: string
): string {
  const now = new Date()
  
  // Generate comprehensive JSON-LD with FAQ schema for AI understanding
  const faqs = generateBusinessFAQs(business, updateData);
  
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": getSchemaType(business.primary_category),
    "name": business.name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress", 
      "streetAddress": business.address_street,
      "addressLocality": business.address_city,
      "addressRegion": business.address_state,
      "postalCode": business.zip_code,
      "addressCountry": business.country || "US"
    },
    "telephone": business.phone,
    "email": business.email,
    "url": business.website,
    "offers": {
      "@type": "Offer",
      "description": updateData.content_text,
      "validFrom": updateData.created_at,
      "validThrough": updateData.expires_at
    },
    "dateModified": now.toISOString(),
    
    // Enhanced AI search fields
    "openingHours": business.hours ? [business.hours] : undefined,
    "paymentAccepted": business.payment_methods || ["Cash", "Credit Card"],
    "areaServed": business.service_area || `${business.address_city}, ${business.address_state}`,
    
    // FAQ Schema for 849% more AI citations
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": faq.answer
      },
      "keywords": faq.voiceSearchTriggers.join(', ')
    }))
  }

  // Clean undefined values
  Object.keys(jsonLD).forEach(key => {
    if (jsonLD[key] === undefined || jsonLD[key] === null) {
      delete jsonLD[key]
    }
  })

  // Use optimized title and description if provided, otherwise fallback to basic
  const pageTitle = optimizedTitle || `${business.name} Update - ${business.address_city}, ${business.address_state}`;
  const pageDescription = optimizedDescription || updateData.content_text;
  
  // Add intent-specific meta tags for better AI search understanding
  const intentMetaTags = intentType ? `
<meta name="page-intent" content="${intentType}">
<meta name="search-optimization" content="ai-powered-${intentType}">
<meta name="content-variant" content="${intentType}-optimized">` : '';
  
  // Pure AI-native HTML - no styling, maximum information
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${pageTitle}</title>
<meta name="description" content="${pageDescription}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="US-${business.address_state}">
<meta name="geo.placename" content="${business.address_city}">
<meta name="article:published_time" content="${updateData.created_at}">${intentMetaTags}
<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>
</head>
<body>
<h1>${business.name} - Current Update</h1>
<p>Business: ${business.name}</p>
<p>Location: ${business.address_city}, ${business.address_state}</p>
<p>Category: ${getCategoryDisplay(business.primary_category)}</p>

<h2>Current Update</h2>
<p>${updateData.content_text}</p>
<p>Published: ${new Date(updateData.created_at).toLocaleDateString()}</p>
${updateData.expires_at ? `<p>Valid Until: ${new Date(updateData.expires_at).toLocaleDateString()}</p>` : ''}

<h2>Business Contact</h2>
<p>Phone: ${business.phone || 'Contact for details'}</p>
<p>Address: ${business.address_street || ''} ${business.address_city}, ${business.address_state} ${business.zip_code || ''}</p>
<p>Email: ${business.email || 'Not provided'}</p>
<p>Website: ${business.website || 'Not provided'}</p>

<h2>Business Details</h2>
<p>Description: ${business.description || 'Local business'}</p>
<p>Services: ${business.services ? business.services.join(', ') : 'Contact for services'}</p>
<p>Specialties: ${business.specialties ? business.specialties.join(', ') : 'Contact for specialties'}</p>
<p>Hours: ${business.hours || 'Contact for hours'}</p>
<p>Price Range: ${business.price_positioning || 'Contact for pricing'}</p>

${generateAIOptimizedFAQSection(business, updateData)}

<h2>Update Information</h2>
<p>Update Type: Business update</p>
<p>Content Type: Real-time business information</p>
<p>Geographic Scope: ${business.address_city}, ${business.address_state}</p>
</body>
</html>`
}

// Schema type mapping
function getSchemaType(category: string): string {
  const typeMap: Record<string, string> = {
    'food-dining': 'Restaurant',
    'shopping': 'Store',
    'beauty-grooming': 'BeautySalon',
    'health-medical': 'MedicalBusiness',
    'repairs-services': 'LocalBusiness',
    'professional-services': 'ProfessionalService',
    'activities-entertainment': 'EntertainmentBusiness',
    'education-training': 'EducationalOrganization',
    'creative-digital': 'LocalBusiness',
    'transportation-delivery': 'LocalBusiness'
  }
  
  return typeMap[category] || 'LocalBusiness'
}

function getCategoryDisplay(category: string): string {
  const categoryMap: Record<string, string> = {
    'food-dining': 'Restaurant',
    'shopping': 'Retail',
    'beauty-grooming': 'Beauty & Grooming',
    'health-medical': 'Healthcare', 
    'repairs-services': 'Repair Services',
    'professional-services': 'Professional Services',
    'activities-entertainment': 'Entertainment',
    'education-training': 'Education',
    'creative-digital': 'Creative Services',
    'transportation-delivery': 'Transportation'
  }
  
  return categoryMap[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// AI-Optimized FAQ Section Generator (849% more AI citations)
function generateAIOptimizedFAQSection(business: any, updateData: any): string {
  const faqs = generateBusinessFAQs(business, updateData);
  
  if (faqs.length === 0) return '';

  // Generate FAQ HTML with Schema.org markup for AI optimization
  const faqHTML = faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${faq.question}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${faq.answer}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="ai-optimized-faq" itemscope itemtype="https://schema.org/FAQPage">
      <h2>Frequently Asked Questions</h2>
      ${faqHTML}
    </section>
  `;
}

// Generate comprehensive business FAQs optimized for voice search and AI citations
function generateBusinessFAQs(business: any, updateData: any): AIOptimizedFAQ[] {
  const faqs: AIOptimizedFAQ[] = [];
  const businessType = detectBusinessType(business.primary_category);

  // Critical Voice Search Questions (Priority 1)
  
  // "Are you open now?" - #1 voice search query
  faqs.push({
    question: `Are you open now?`,
    answer: generateHoursAnswer(business),
    category: 'hours',
    priority: 1,
    voiceSearchTriggers: ['are you open', 'open now', 'current hours'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // "Where are you located?" - #2 voice search query  
  faqs.push({
    question: `Where is ${business.name} located?`,
    answer: generateLocationAnswer(business),
    category: 'location',
    priority: 1,
    voiceSearchTriggers: ['where are you', 'location', 'address'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // "How can I contact you?" - #3 voice search query
  faqs.push({
    question: `How can I contact ${business.name}?`,
    answer: generateContactAnswer(business),
    category: 'contact',
    priority: 1,
    voiceSearchTriggers: ['phone number', 'contact', 'call you'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // Business-type specific critical questions
  if (businessType === 'restaurant') {
    faqs.push({
      question: `Do you deliver?`,
      answer: business.service_area ? 
        `Yes, ${business.name} delivers to ${business.service_area}. Call ${business.phone} to place an order.` :
        `Contact ${business.name} at ${business.phone} for delivery availability and area coverage.`,
      category: 'services',
      priority: 1,
      voiceSearchTriggers: ['do you deliver', 'delivery available', 'takeout'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  if (businessType === 'medical') {
    faqs.push({
      question: `Are you accepting new patients?`,
      answer: business.availability_policy?.type === 'accepting-new-patients' ?
        `Yes, ${business.name} is currently accepting new patients. Call ${business.phone} to schedule.` :
        `Contact ${business.name} at ${business.phone} to check current patient availability.`,
      category: 'availability', 
      priority: 1,
      voiceSearchTriggers: ['new patients', 'accepting patients', 'appointments'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Services FAQ (if services available)
  if (business.services && business.services.length > 0) {
    faqs.push({
      question: `What services does ${business.name} offer?`,
      answer: `${business.name} offers ${business.services.join(', ')}. Contact us at ${business.phone} for more details.`,
      category: 'services',
      priority: 2,
      voiceSearchTriggers: ['what services', 'services offered'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Payment methods FAQ (critical for retail/restaurants)
  if (business.payment_methods && business.payment_methods.length > 0) {
    faqs.push({
      question: `What payment methods do you accept?`,
      answer: `${business.name} accepts ${business.payment_methods.join(', ')}. Contact us if you have payment questions.`,
      category: 'policies',
      priority: 2, 
      voiceSearchTriggers: ['payment methods', 'credit card', 'cash'],
      aiSearchRelevance: 'medium',
      characterCount: 0
    });
  }

  // Update-specific FAQ
  if (updateData.content_text) {
    faqs.push({
      question: `What's your current special?`,
      answer: `${updateData.content_text}. ${updateData.expires_at ? `Valid until ${new Date(updateData.expires_at).toLocaleDateString()}.` : ''} Call ${business.phone} for details.`,
      category: 'availability',
      priority: 1,
      voiceSearchTriggers: ['current special', 'deals today', 'what specials'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Calculate character counts and optimize for AI (50-65 words optimal)
  faqs.forEach(faq => {
    faq.characterCount = faq.answer.length;
  });

  // Use existing business_faqs if available
  if (business.business_faqs && Array.isArray(business.business_faqs) && business.business_faqs.length > 0) {
    faqs.push(...business.business_faqs.map((existingFaq: any) => ({
      question: existingFaq.question,
      answer: existingFaq.answer,
      category: existingFaq.category || 'services',
      priority: existingFaq.priority || 2,
      voiceSearchTriggers: existingFaq.searchTerms || [],
      aiSearchRelevance: 'medium',
      characterCount: existingFaq.answer.length
    })));
  }

  return faqs.slice(0, 8); // Limit to 8 FAQs for optimal AI parsing
}

// Generate conversational answers for AI optimization
function generateHoursAnswer(business: any): string {
  if (!business.hours) {
    return `Contact ${business.name} at ${business.phone || 'our listed number'} for current hours and availability.`;
  }
  
  return `${business.name} is open ${business.hours}. Call ${business.phone || 'us'} to confirm current hours and availability.`;
}

function generateLocationAnswer(business: any): string {
  const address = [business.address_street, business.address_city, business.address_state, business.zip_code]
    .filter(Boolean).join(', ');
  
  let answer = `${business.name} is located at ${address || `${business.address_city}, ${business.address_state}`}.`;
  
  if (business.parking_info) {
    answer += ` ${business.parking_info}`;
  } else {
    answer += ` Contact us for parking information.`;
  }
  
  return answer;
}

function generateContactAnswer(business: any): string {
  const methods = [];
  if (business.phone) methods.push(`call ${business.phone}`);
  if (business.email) methods.push(`email ${business.email}`);
  if (business.website) methods.push(`visit ${business.website}`);
  
  return `You can ${methods.join(', ')} to reach ${business.name}. We're located in ${business.address_city}, ${business.address_state}.`;
}

function detectBusinessType(category: string): string {
  if (!category) return 'general';
  if (category.includes('food') || category.includes('dining')) return 'restaurant';
  if (category.includes('health') || category.includes('medical')) return 'medical';
  if (category.includes('shopping')) return 'retail';
  if (category.includes('professional')) return 'professional';
  return 'general';
}

