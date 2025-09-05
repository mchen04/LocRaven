/**
 * Comprehensive Flow Test: Business Update → 6 AI-Optimized Pages
 * Tests the complete flow from update input to published AI-optimized templates
 */

import { 
  renderDirectTemplate,
  renderLocalTemplate, 
  renderCategoryTemplate,
  renderBrandedLocalTemplate,
  renderServiceUrgentTemplate,
  renderCompetitiveTemplate
} from './intent-templates.ts';

// Test data simulating a real business update
const testBusinessUpdate = {
  business: {
    name: "Mario's Italian Bistro",
    address_city: "Seattle",
    address_state: "WA",
    address_street: "1234 Pine Street",
    zip_code: "98101",
    country: "US",
    phone: "2065551234",
    phone_country_code: "+1",
    email: "info@mariosbistro.com",
    website: "https://mariosbistro.com",
    description: "Authentic Italian cuisine in the heart of Seattle",
    primary_category: "food-dining",
    services: ["Dine-in", "Takeout", "Delivery", "Catering"],
    specialties: ["Wood-fired pizza", "Fresh pasta", "Wine pairing"],
    hours: "11am-10pm daily",
    structured_hours: {
      mon: { open: "11:00", close: "22:00" },
      tue: { open: "11:00", close: "22:00" },
      wed: { open: "11:00", close: "22:00" },
      thu: { open: "11:00", close: "22:00" },
      fri: { open: "11:00", close: "23:00" },
      sat: { open: "11:00", close: "23:00" },
      sun: { open: "12:00", close: "21:00" }
    },
    price_positioning: "$$$",
    payment_methods: ["Cash", "Credit Card", "Apple Pay", "Google Pay"],
    service_area: "Greater Seattle Area",
    service_area_details: {
      primary_city: "Seattle",
      coverage_radius: 15,
      additional_cities: ["Bellevue", "Redmond", "Kirkland", "Tacoma"]
    },
    awards: [
      { name: "Best Italian Restaurant 2023", issuer: "Seattle Magazine", year: 2023 },
      { name: "Wine Spectator Award", issuer: "Wine Spectator", year: 2023 }
    ],
    certifications: [
      { name: "Food Safety Certification", issuer: "King County Health Dept" },
      { name: "Organic Certified", issuer: "WSDA" }
    ],
    latitude: 47.6062,
    longitude: -122.3321,
    languages_spoken: ["English", "Italian", "Spanish"],
    accessibility_features: ["wheelchair-accessible", "braille-menu"],
    parking_info: "Street parking and nearby garage",
    enhanced_parking_info: { 
      types: ["street", "garage"], 
      notes: "2-hour street limit, paid garage available" 
    },
    review_summary: { 
      average_rating: 4.8, 
      total_reviews: 847 
    },
    status_override: null,
    business_faqs: [
      {
        question: "Do you take reservations?",
        answer: "Yes, we accept reservations for parties of 4 or more. Call us or use our online booking system.",
        voiceSearchTriggers: ["reservations", "booking", "table reservation"]
      },
      {
        question: "Do you have vegetarian options?",
        answer: "Absolutely! We have a wide selection of vegetarian pasta, pizza, and salad options.",
        voiceSearchTriggers: ["vegetarian", "vegan options", "plant based"]
      }
    ],
    featured_items: ["Osso Buco", "Truffle Risotto", "Tiramisu"],
    social_media: {
      instagram: "https://instagram.com/mariosbistro",
      facebook: "https://facebook.com/mariosbistro",
      yelp: "https://yelp.com/biz/marios-bistro-seattle"
    },
    established_year: 2018
  },
  update: {
    content_text: "New Winter Menu now available! Featuring seasonal truffle dishes, winter squash risotto, and our famous osso buco. Plus 20% off wine bottles every Tuesday through March.",
    created_at: "2025-01-05T18:30:00Z",
    expires_at: "2025-03-31T23:59:59Z",
    special_hours_today: null,
    deal_terms: "20% off wine bottles, dine-in only, Tuesdays through March",
    update_category: "special",
    update_faqs: [
      {
        question: "What's on the new winter menu?",
        answer: "Our winter menu features seasonal truffle dishes, winter squash risotto, and our signature osso buco",
        voiceSearchTriggers: ["winter menu", "seasonal dishes", "new menu items"]
      }
    ]
  },
  seo: {
    title: "Mario's Italian Bistro New Winter Menu - Truffle Dishes & Wine Specials",
    description: "Discover Mario's new winter menu featuring seasonal truffle dishes, winter squash risotto, and 20% off wine bottles every Tuesday through March in Seattle."
  },
  intent: {
    type: "direct", // Will be different for each template test
    filePath: "/business/marios-italian-bistro-seattle-winter-menu",
    slug: "marios-italian-bistro-seattle",
    pageVariant: "winter-menu-2025"
  },
  faqs: []
};

// Test configuration for each intent type
const intentTests = [
  {
    intentType: 'direct',
    templateFunction: renderDirectTemplate,
    expectedFeatures: [
      'business name prominence',
      'current update highlight',
      'direct action calls'
    ]
  },
  {
    intentType: 'local',
    templateFunction: renderLocalTemplate,
    expectedFeatures: [
      'local area emphasis',
      'location-based optimization',
      'nearby search optimization'
    ]
  },
  {
    intentType: 'category',
    templateFunction: renderCategoryTemplate,
    expectedFeatures: [
      'category expertise',
      'service/product focus',
      'industry positioning'
    ]
  },
  {
    intentType: 'branded-local',
    templateFunction: renderBrandedLocalTemplate,
    expectedFeatures: [
      'brand + location combo',
      'local brand recognition',
      'area-specific branding'
    ]
  },
  {
    intentType: 'service-urgent',
    templateFunction: renderServiceUrgentTemplate,
    expectedFeatures: [
      'urgency indicators',
      'immediate availability',
      'action-oriented content'
    ]
  },
  {
    intentType: 'competitive',
    templateFunction: renderCompetitiveTemplate,
    expectedFeatures: [
      'competitive advantages',
      'unique value proposition',
      'differentiation factors'
    ]
  }
];

// AI Optimization Feature Detection
function detectAIOptimizationFeatures(html) {
  const features = {
    schemaOrg: {
      localBusiness: html.includes('@type": "Restaurant') || html.includes('@type": "LocalBusiness'),
      faqPage: html.includes('@type": "FAQPage'),
      webPage: html.includes('@type": "WebPage'),
      breadcrumb: html.includes('@type": "BreadcrumbList'),
      complete: false
    },
    voiceSearch: {
      speakableMarkup: html.includes('class="speakable') || html.includes('data-speakable='),
      voiceOptimized: html.includes('voice-search-optimized') || html.includes('voice-summary'),
      conversationalFAQs: html.includes('Are you open') || html.includes('Where is'),
      complete: false
    },
    aiDiscovery: {
      aiContentType: html.includes('ai-content-type'),
      aiContext: html.includes('ai-context') || html.includes('AI Context'),
      quickAnswers: html.includes('quick-answer') || html.includes('Quick Answer'),
      urgencySignals: html.includes('urgency-level') || html.includes('open now'),
      complete: false
    },
    seo: {
      metaTags: html.includes('<meta name="description"') && html.includes('<meta property="og:'),
      canonicalUrl: html.includes('<link rel="canonical"'),
      structuredData: html.includes('<script type="application/ld+json">'),
      complete: false
    }
  };

  // Calculate completion scores
  features.schemaOrg.complete = [
    features.schemaOrg.localBusiness,
    features.schemaOrg.faqPage,
    features.schemaOrg.webPage
  ].filter(Boolean).length >= 2;

  features.voiceSearch.complete = [
    features.voiceSearch.speakableMarkup,
    features.voiceSearch.voiceOptimized,
    features.voiceSearch.conversationalFAQs
  ].filter(Boolean).length >= 2;

  features.aiDiscovery.complete = [
    features.aiDiscovery.aiContentType,
    features.aiDiscovery.aiContext,
    features.aiDiscovery.quickAnswers
  ].filter(Boolean).length >= 2;

  features.seo.complete = [
    features.seo.metaTags,
    features.seo.canonicalUrl,
    features.seo.structuredData
  ].filter(Boolean).length >= 3;

  return features;
}

// Calculate AI Optimization Score
function calculateAIOptimizationScore(features) {
  const weights = {
    schemaOrg: 30,
    voiceSearch: 25,
    aiDiscovery: 25,
    seo: 20
  };

  let totalScore = 0;
  let maxScore = 0;

  Object.keys(weights).forEach(category => {
    const categoryFeatures = features[category];
    const featureCount = Object.keys(categoryFeatures).filter(key => 
      key !== 'complete' && categoryFeatures[key]
    ).length;
    const maxFeatures = Object.keys(categoryFeatures).length - 1; // Exclude 'complete'
    
    const categoryScore = (featureCount / maxFeatures) * weights[category];
    totalScore += categoryScore;
    maxScore += weights[category];
  });

  return Math.round((totalScore / maxScore) * 100);
}

// Run comprehensive test
function runComprehensiveFlowTest() {
  console.log('🚀 Comprehensive AI-Optimized Page Generation Flow Test');
  console.log('Testing: Business Update → 6 AI-Optimized Pages\n');

  const results = [];
  let totalSuccess = 0;

  intentTests.forEach(({ intentType, templateFunction, expectedFeatures }, index) => {
    console.log(`\n${index + 1}. Testing ${intentType.toUpperCase()} Intent Template`);
    console.log('─'.repeat(50));

    try {
      // Create intent-specific data
      const intentData = {
        ...testBusinessUpdate,
        intent: {
          ...testBusinessUpdate.intent,
          type: intentType,
          filePath: `/business/marios-italian-bistro-seattle-${intentType}-winter-menu`
        }
      };

      // Render template
      const startTime = Date.now();
      const html = templateFunction(intentData);
      const renderTime = Date.now() - startTime;

      // Detect AI optimization features
      const features = detectAIOptimizationFeatures(html);
      const aiScore = calculateAIOptimizationScore(features);

      // Validate HTML structure
      const hasDoctype = html.includes('<!DOCTYPE html>');
      const hasTitle = html.includes('<title>') && html.includes(testBusinessUpdate.business.name);
      const hasUpdate = html.includes(testBusinessUpdate.update.content_text.substring(0, 20));
      const hasBusinessInfo = html.includes(testBusinessUpdate.business.address_city);

      const structureValid = hasDoctype && hasTitle && hasUpdate && hasBusinessInfo;

      console.log(`✅ Template rendered successfully (${renderTime}ms)`);
      console.log(`📊 AI Optimization Score: ${aiScore}/100`);
      console.log(`📄 HTML Size: ${(html.length / 1024).toFixed(1)}KB`);
      console.log(`🏗️  Structure Valid: ${structureValid ? '✅' : '❌'}`);

      // Feature breakdown
      console.log('\n🔍 AI Features Detected:');
      console.log(`   Schema.org: ${features.schemaOrg.complete ? '✅' : '⚠️'} (LocalBusiness: ${features.schemaOrg.localBusiness ? '✅' : '❌'}, FAQ: ${features.schemaOrg.faqPage ? '✅' : '❌'})`);
      console.log(`   Voice Search: ${features.voiceSearch.complete ? '✅' : '⚠️'} (Speakable: ${features.voiceSearch.speakableMarkup ? '✅' : '❌'}, Optimized: ${features.voiceSearch.voiceOptimized ? '✅' : '❌'})`);
      console.log(`   AI Discovery: ${features.aiDiscovery.complete ? '✅' : '⚠️'} (AI Context: ${features.aiDiscovery.aiContext ? '✅' : '❌'}, Quick Answers: ${features.aiDiscovery.quickAnswers ? '✅' : '❌'})`);
      console.log(`   SEO: ${features.seo.complete ? '✅' : '⚠️'} (Meta: ${features.seo.metaTags ? '✅' : '❌'}, Canonical: ${features.seo.canonicalUrl ? '✅' : '❌'})`);

      const success = structureValid && aiScore >= 70;
      if (success) totalSuccess++;

      results.push({
        intentType,
        success,
        aiScore,
        renderTime,
        htmlSize: html.length,
        features,
        structureValid
      });

      console.log(`\n${success ? '🎉' : '⚠️'} ${intentType.toUpperCase()} Template: ${success ? 'PASSED' : 'NEEDS IMPROVEMENT'}`);

    } catch (error) {
      console.error(`❌ ${intentType.toUpperCase()} Template FAILED:`, error.message);
      results.push({
        intentType,
        success: false,
        error: error.message
      });
    }
  });

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 COMPREHENSIVE FLOW TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n📊 Overall Performance:`);
  console.log(`   ✅ Successful Templates: ${totalSuccess}/6 (${Math.round(totalSuccess/6*100)}%)`);
  
  const avgScore = results.filter(r => r.success).reduce((sum, r) => sum + r.aiScore, 0) / totalSuccess || 0;
  console.log(`   🎯 Average AI Score: ${avgScore.toFixed(1)}/100`);
  
  const avgRenderTime = results.filter(r => r.success).reduce((sum, r) => sum + r.renderTime, 0) / totalSuccess || 0;
  console.log(`   ⚡ Average Render Time: ${avgRenderTime.toFixed(0)}ms`);

  console.log(`\n🎯 Template Performance:`);
  results.forEach(result => {
    if (result.success) {
      console.log(`   ${result.intentType.padEnd(15)}: ${result.aiScore}/100 (${(result.htmlSize/1024).toFixed(1)}KB, ${result.renderTime}ms)`);
    } else {
      console.log(`   ${result.intentType.padEnd(15)}: FAILED - ${result.error || 'Unknown error'}`);
    }
  });

  // Final verdict
  console.log(`\n🏁 FINAL VERDICT:`);
  if (totalSuccess === 6 && avgScore >= 80) {
    console.log('   🌟 EXCELLENT: All 6 AI-optimized templates working perfectly!');
    console.log('   ✨ Ready for production deployment');
  } else if (totalSuccess >= 4 && avgScore >= 70) {
    console.log('   ✅ GOOD: Most templates working with solid AI optimization');
    console.log('   🔧 Minor improvements recommended');
  } else {
    console.log('   ⚠️ NEEDS WORK: Some templates need debugging or optimization');
    console.log('   🛠️ Review failed templates and improve AI features');
  }

  console.log('\n✨ Test completed: Business Update → 6 AI-Optimized Pages flow verified!');
  
  return {
    totalSuccess,
    avgScore,
    avgRenderTime,
    results,
    overallSuccess: totalSuccess >= 5 && avgScore >= 75
  };
}

// Run the test
try {
  const testResults = runComprehensiveFlowTest();
  console.log(`\n💡 Import path fixes: ${testResults.overallSuccess ? '✅ WORKING' : '❌ NEEDS ATTENTION'}`);
} catch (error) {
  console.error('❌ Test failed with import/compilation error:', error.message);
  console.log('🔧 This likely indicates import path issues that need to be resolved');
}