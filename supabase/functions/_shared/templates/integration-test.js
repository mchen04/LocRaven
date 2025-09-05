/**
 * Integration test for complete template flow:
 * Test Data → Compression → Decompression → Template Rendering → AI Optimization Validation
 */

import { createPageData, compressPageData } from '../simple-template-engine.ts'
import { 
  renderDirectTemplate,
  renderLocalTemplate, 
  renderCategoryTemplate,
  renderBrandedLocalTemplate,
  renderServiceUrgentTemplate,
  renderCompetitiveTemplate
} from './intent-templates.js'

// Test data (same as test-templates.js)
const testData = {
  business: {
    name: "Joe's Pizza",
    address_city: "Seattle",
    address_state: "WA",
    address_street: "123 Main St",
    zip_code: "98101",
    country: "US",
    phone: "2065550100",
    phone_country_code: "+1",
    email: "joe@joespizza.com",
    website: "https://joespizza.com",
    description: "Best pizza in Seattle",
    services: ["Dine-in", "Takeout", "Delivery"],
    specialties: ["Wood-fired pizza", "Craft beer"],
    hours: "11am-10pm",
    structured_hours: {
      mon: { open: "11:00", close: "22:00" },
      tue: { open: "11:00", close: "22:00" },
      wed: { open: "11:00", close: "22:00" },
      thu: { open: "11:00", close: "22:00" },
      fri: { open: "11:00", close: "23:00" },
      sat: { open: "11:00", close: "23:00" },
      sun: { open: "12:00", close: "21:00" }
    },
    price_positioning: "$$",
    payment_methods: ["Cash", "Credit Card", "Digital Payment"],
    primary_category: "food-dining",
    service_area: "Greater Seattle Area",
    service_area_details: {
      primary_city: "Seattle",
      coverage_radius: 10,
      additional_cities: ["Bellevue", "Redmond", "Kirkland"]
    },
    awards: [
      { name: "Best Pizza in Seattle 2023", issuer: "Seattle Times", year: 2023 }
    ],
    certifications: [
      { name: "Food Safety Certification", issuer: "King County Health Dept" }
    ],
    latitude: 47.6062,
    longitude: -122.3321,
    languages_spoken: ["English", "Spanish"],
    accessibility_features: ["wheelchair-accessible"],
    parking_info: "Street parking available",
    enhanced_parking_info: { types: ["street", "paid"], notes: "2-hour limit" },
    review_summary: { average_rating: 4.7, total_reviews: 342 },
    status_override: null,
    business_faqs: [
      {
        question: "Do you deliver?",
        answer: "Yes, we deliver within a 5-mile radius.",
        voiceSearchTriggers: ["deliver", "delivery", "do you deliver"]
      }
    ],
    featured_items: ["Margherita Pizza", "Craft Beer Selection"],
    social_media: {
      instagram: "https://instagram.com/joespizza",
      facebook: "https://facebook.com/joespizza"
    },
    established_year: 2015
  },
  update: {
    content_text: "New fall menu available Sept 7-14! Try our pumpkin spice pizza and apple cider donuts.",
    created_at: "2024-09-07T10:00:00Z",
    expires_at: "2024-09-14T23:59:59Z",
    special_hours_today: null,
    deal_terms: "Limited time offer",
    update_category: "special",
    update_faqs: [
      {
        question: "What's on the fall menu?",
        answer: "Pumpkin spice pizza and apple cider donuts",
        voiceSearchTriggers: ["fall menu", "seasonal", "pumpkin spice"]
      }
    ]
  },
  seo: {
    title: "Joe's Pizza New Fall Menu - Limited Time Sept 7-14",
    description: "Try Joe's Pizza's new fall menu featuring pumpkin spice pizza and apple cider donuts. Available Sept 7-14 in Seattle."
  },
  intent: {
    type: "direct",
    filePath: "/business/joes-pizza-seattle-fall-menu",
    slug: "joes-pizza-seattle",
    pageVariant: "fall-menu-2024"
  },
  faqs: []
};

// Simulate publish-pages decompression function
function decompressPageData(compressed) {
  return {
    business: {
      name: compressed.b?.n,
      address_city: compressed.b?.c,
      address_state: compressed.b?.s,
      address_street: compressed.b?.st,
      zip_code: compressed.b?.z,
      country: compressed.b?.country || 'US',
      phone: compressed.b?.p,
      phone_country_code: compressed.b?.pcc,
      email: compressed.b?.e,
      website: compressed.b?.w,
      description: compressed.b?.d,
      primary_category: compressed.b?.cat,
      services: compressed.b?.srv,
      specialties: compressed.b?.sp,
      hours: compressed.b?.h,
      structured_hours: compressed.b?.sh,
      price_positioning: compressed.b?.pr,
      payment_methods: compressed.b?.pm || ['Cash', 'Credit Card'],
      service_area: compressed.b?.sa,
      service_area_details: compressed.b?.sad,
      awards: compressed.b?.aw,
      certifications: compressed.b?.cert,
      latitude: compressed.b?.lat,
      longitude: compressed.b?.lng,
      languages_spoken: compressed.b?.lang,
      accessibility_features: compressed.b?.acc,
      parking_info: compressed.b?.park,
      enhanced_parking_info: compressed.b?.epark,
      review_summary: compressed.b?.rev,
      status_override: compressed.b?.stat,
      business_faqs: compressed.b?.faqs,
      featured_items: compressed.b?.feat,
      social_media: compressed.b?.social,
      established_year: compressed.b?.est
    },
    update: {
      content_text: compressed.u?.t,
      created_at: compressed.u?.ca,
      expires_at: compressed.u?.ea,
      special_hours_today: compressed.u?.sh,
      deal_terms: compressed.u?.dt,
      update_category: compressed.u?.cat,
      update_faqs: compressed.u?.faqs
    },
    seo: compressed.seo || {},
    intent: compressed.i || {},
    faqs: compressed.f || []
  };
}

// Test template rendering with AI optimization validation
function testTemplateRendering(templateName, renderFunction, pageData) {
  console.log(`\n🧪 Testing ${templateName} template...`);
  
  try {
    const html = renderFunction(pageData);
    
    // AI Optimization Validation Checks
    const checks = {
      'DOCTYPE HTML5': html.includes('<!DOCTYPE html>'),
      'Schema.org LocalBusiness': html.includes('"@type":"Restaurant"') || html.includes('"@type":"LocalBusiness"'),
      'FAQ Schema': html.includes('"@type":"FAQPage"') || html.includes('"@type":"Question"'),
      'Breadcrumb Schema': html.includes('"@type":"BreadcrumbList"'),
      'Voice Search Meta': html.includes('voice-search') || html.includes('speakable'),
      'Geo Coordinates': html.includes('"latitude":47.6062') && html.includes('"longitude":-122.3321'),
      'Business Hours Schema': html.includes('OpeningHoursSpecification') || html.includes('"opens"'),
      'Accessibility Features': html.includes('wheelchair-accessible'),
      'Real-time Status': html.includes('open') || html.includes('available') || html.includes('currently'),
      'Contact Information': html.includes('2065550100') && html.includes('joe@joespizza.com'),
      'Service Area': html.includes('Seattle') && html.includes('Bellevue'),
      'Awards/Reviews': html.includes('4.7') || html.includes('Best Pizza'),
      'Social Media': html.includes('instagram.com/joespizza'),
      'AI Context Block': html.includes('ai-context') || html.includes('urgent-info'),
      'Voice Summary': html.includes('voice-summary') || html.includes('quick-answer'),
      'Update Content': html.includes('pumpkin spice pizza') && html.includes('apple cider donuts'),
      'SEO Title': html.includes("Joe's Pizza New Fall Menu"),
      'Meta Description': html.includes('meta name="description"'),
      'Canonical URL': html.includes('rel="canonical"'),
      'Speakable Markup': html.includes('speakable') || html.includes('cssSelector')
    };
    
    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const score = (passed / total * 100).toFixed(1);
    
    console.log(`✅ ${templateName}: ${passed}/${total} checks passed (${score}%)`);
    
    // Show failed checks
    const failed = Object.entries(checks).filter(([_, passed]) => !passed);
    if (failed.length > 0) {
      console.log(`⚠️  Failed checks: ${failed.map(([check]) => check).join(', ')}`);
    }
    
    return { score: parseFloat(score), passed, total, failed: failed.map(([check]) => check) };
    
  } catch (error) {
    console.error(`❌ ${templateName} template error:`, error.message);
    return { score: 0, passed: 0, total: 20, failed: ['Template execution failed'] };
  }
}

// Run integration test
function runIntegrationTest() {
  console.log('🚀 Starting AI-Optimized Template Integration Test\n');
  
  try {
    // Step 1: Create page data
    const pageData = createPageData(testData.business, testData.update, testData.seo, testData.intent);
    console.log('✅ Step 1: Page data created');
    
    // Step 2: Compress data (simulate generation)
    const compressedData = compressPageData(pageData);
    console.log('✅ Step 2: Page data compressed');
    
    // Step 3: Decompress data (simulate publish-pages)
    const decompressedData = decompressPageData(compressedData);
    console.log('✅ Step 3: Page data decompressed');
    
    // Step 4: Test all 6 templates
    const templates = [
      ['Direct', renderDirectTemplate],
      ['Local', renderLocalTemplate],
      ['Category', renderCategoryTemplate],
      ['Branded-Local', renderBrandedLocalTemplate],
      ['Service-Urgent', renderServiceUrgentTemplate],
      ['Competitive', renderCompetitiveTemplate]
    ];
    
    const results = [];
    for (const [name, renderFn] of templates) {
      const result = testTemplateRendering(name, renderFn, decompressedData);
      results.push({ template: name, ...result });
    }
    
    // Overall Results
    const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);
    const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
    const totalChecks = results.reduce((sum, r) => sum + r.total, 0);
    
    console.log('\n📊 Integration Test Results:');
    console.log(`Overall AI Optimization Score: ${avgScore}%`);
    console.log(`Total Checks: ${totalPassed}/${totalChecks} passed`);
    
    // Template Rankings
    console.log('\n🏆 Template Rankings:');
    results.sort((a, b) => b.score - a.score);
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.template}: ${r.score}% (${r.passed}/${r.total})`);
    });
    
    // Common Issues
    const allFailed = results.flatMap(r => r.failed);
    const commonIssues = {};
    allFailed.forEach(issue => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1;
    });
    
    if (Object.keys(commonIssues).length > 0) {
      console.log('\n⚠️  Common Issues Across Templates:');
      Object.entries(commonIssues)
        .sort(([,a], [,b]) => b - a)
        .forEach(([issue, count]) => {
          console.log(`${issue}: ${count}/${templates.length} templates affected`);
        });
    }
    
    if (avgScore >= 85) {
      console.log('\n🎉 Integration Test: PASSED - Templates are production ready!');
    } else if (avgScore >= 70) {
      console.log('\n⚠️  Integration Test: PARTIAL - Templates need minor improvements');
    } else {
      console.log('\n❌ Integration Test: FAILED - Templates need significant work');
    }
    
    return avgScore >= 85;
    
  } catch (error) {
    console.error('\n💥 Integration test failed:', error);
    return false;
  }
}

// Run the test
console.log('Starting template integration test...');
runIntegrationTest();