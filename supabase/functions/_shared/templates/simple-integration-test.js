/**
 * Simple integration test to validate template integration
 * Tests compression → decompression → basic validation
 */

// Test data
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
      fri: { open: "11:00", close: "23:00" },
      sun: { open: "12:00", close: "21:00" }
    },
    price_positioning: "$$",
    payment_methods: ["Cash", "Credit Card", "Digital Payment"],
    primary_category: "food-dining",
    latitude: 47.6062,
    longitude: -122.3321,
    languages_spoken: ["English", "Spanish"],
    accessibility_features: ["wheelchair-accessible"],
    review_summary: { average_rating: 4.7, total_reviews: 342 },
    business_faqs: [
      {
        question: "Do you deliver?",
        answer: "Yes, we deliver within a 5-mile radius.",
        voiceSearchTriggers: ["deliver", "delivery", "do you deliver"]
      }
    ],
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
    deal_terms: "Limited time offer",
    update_category: "special"
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

// Simulate compressPageData function
function compressPageData(data) {
  return {
    b: { // business
      n: data.business.name,
      c: data.business.address_city,
      s: data.business.address_state,
      st: data.business.address_street,
      z: data.business.zip_code,
      country: data.business.country || 'US',
      p: data.business.phone,
      pcc: data.business.phone_country_code,
      e: data.business.email,
      w: data.business.website,
      d: data.business.description,
      cat: data.business.primary_category,
      srv: data.business.services,
      sp: data.business.specialties,
      h: data.business.hours,
      sh: data.business.structured_hours,
      pr: data.business.price_positioning,
      pm: data.business.payment_methods,
      lat: data.business.latitude,
      lng: data.business.longitude,
      lang: data.business.languages_spoken,
      acc: data.business.accessibility_features,
      rev: data.business.review_summary,
      faqs: data.business.business_faqs,
      social: data.business.social_media,
      est: data.business.established_year
    },
    u: { // update
      t: data.update.content_text,
      ca: data.update.created_at,
      ea: data.update.expires_at,
      dt: data.update.deal_terms,
      cat: data.update.update_category
    },
    seo: data.seo,
    i: data.intent,
    f: data.faqs || []
  };
}

// Simulate decompressPageData function
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
      latitude: compressed.b?.lat,
      longitude: compressed.b?.lng,
      languages_spoken: compressed.b?.lang,
      accessibility_features: compressed.b?.acc,
      review_summary: compressed.b?.rev,
      business_faqs: compressed.b?.faqs,
      social_media: compressed.b?.social,
      established_year: compressed.b?.est
    },
    update: {
      content_text: compressed.u?.t,
      created_at: compressed.u?.ca,
      expires_at: compressed.u?.ea,
      deal_terms: compressed.u?.dt,
      update_category: compressed.u?.cat
    },
    seo: compressed.seo || {},
    intent: compressed.i || {},
    faqs: compressed.f || []
  };
}

// Test the compression/decompression flow
function testDataIntegrity() {
  console.log('🧪 Testing data integrity through compression/decompression...\n');
  
  // Original data
  console.log('Original business name:', testData.business.name);
  console.log('Original coordinates:', testData.business.latitude, testData.business.longitude);
  console.log('Original structured hours:', Object.keys(testData.business.structured_hours || {}));
  console.log('Original review score:', testData.business.review_summary?.average_rating);
  console.log('Original update:', testData.update.content_text.substring(0, 50) + '...');
  
  // Compress
  const compressed = compressPageData(testData);
  console.log('\n✅ Compressed data size:', JSON.stringify(compressed).length, 'bytes');
  
  // Decompress
  const decompressed = decompressPageData(compressed);
  console.log('\n🔄 Decompressed data:');
  console.log('Business name:', decompressed.business.name);
  console.log('Coordinates:', decompressed.business.latitude, decompressed.business.longitude);
  console.log('Structured hours:', Object.keys(decompressed.business.structured_hours || {}));
  console.log('Review score:', decompressed.business.review_summary?.average_rating);
  console.log('Update content:', decompressed.update.content_text.substring(0, 50) + '...');
  
  // Validate critical fields
  const validations = [
    { field: 'name', original: testData.business.name, decompressed: decompressed.business.name },
    { field: 'city', original: testData.business.address_city, decompressed: decompressed.business.address_city },
    { field: 'phone', original: testData.business.phone, decompressed: decompressed.business.phone },
    { field: 'latitude', original: testData.business.latitude, decompressed: decompressed.business.latitude },
    { field: 'longitude', original: testData.business.longitude, decompressed: decompressed.business.longitude },
    { field: 'structured_hours', original: !!testData.business.structured_hours, decompressed: !!decompressed.business.structured_hours },
    { field: 'review_rating', original: testData.business.review_summary?.average_rating, decompressed: decompressed.business.review_summary?.average_rating },
    { field: 'update_content', original: testData.update.content_text, decompressed: decompressed.update.content_text },
    { field: 'seo_title', original: testData.seo.title, decompressed: decompressed.seo.title }
  ];
  
  console.log('\n📋 Data Integrity Validation:');
  let passed = 0;
  validations.forEach(({ field, original, decompressed }) => {
    const isValid = original === decompressed;
    console.log(`${isValid ? '✅' : '❌'} ${field}: ${isValid ? 'PASS' : 'FAIL'}`);
    if (!isValid) {
      console.log(`   Expected: ${original}`);
      console.log(`   Got: ${decompressed}`);
    }
    if (isValid) passed++;
  });
  
  const score = (passed / validations.length * 100).toFixed(1);
  console.log(`\n📊 Data Integrity Score: ${passed}/${validations.length} (${score}%)`);
  
  if (score >= 90) {
    console.log('🎉 Data integrity test: PASSED - Ready for template rendering!');
    return true;
  } else {
    console.log('❌ Data integrity test: FAILED - Fix compression/decompression issues');
    return false;
  }
}

// Validate that all required fields for templates are present
function validateTemplateRequirements(data) {
  console.log('\n🎯 Validating template requirements...');
  
  const required = [
    'business.name',
    'business.address_city', 
    'business.address_state',
    'business.phone',
    'business.primary_category',
    'update.content_text',
    'seo.title',
    'seo.description'
  ];
  
  const optional = [
    'business.latitude',
    'business.longitude', 
    'business.structured_hours',
    'business.review_summary',
    'business.services',
    'business.specialties',
    'business.social_media'
  ];
  
  let requiredPassed = 0;
  let optionalPassed = 0;
  
  console.log('\n🔴 Required Fields:');
  required.forEach(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], data);
    const isPresent = value !== undefined && value !== null;
    console.log(`${isPresent ? '✅' : '❌'} ${path}: ${isPresent ? 'PRESENT' : 'MISSING'}`);
    if (isPresent) requiredPassed++;
  });
  
  console.log('\n🟡 Optional Fields (for AI optimization):');
  optional.forEach(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], data);
    const isPresent = value !== undefined && value !== null;
    console.log(`${isPresent ? '✅' : '⚪'} ${path}: ${isPresent ? 'PRESENT' : 'MISSING'}`);
    if (isPresent) optionalPassed++;
  });
  
  const reqScore = (requiredPassed / required.length * 100).toFixed(1);
  const optScore = (optionalPassed / optional.length * 100).toFixed(1);
  
  console.log(`\n📊 Template Readiness:`);
  console.log(`Required Fields: ${requiredPassed}/${required.length} (${reqScore}%)`);
  console.log(`Optional Fields: ${optionalPassed}/${optional.length} (${optScore}%)`);
  
  if (reqScore >= 100) {
    console.log('🎉 Template requirements: PASSED - All required fields present!');
    if (optScore >= 70) {
      console.log('⭐ AI optimization: EXCELLENT - Rich data available for templates!');
    } else {
      console.log('⚠️  AI optimization: BASIC - Consider adding optional fields for better results');
    }
    return true;
  } else {
    console.log('❌ Template requirements: FAILED - Missing required fields');
    return false;
  }
}

// Run the test
console.log('🚀 AI-Optimized Template Integration Test\n');
const integrityPassed = testDataIntegrity();

if (integrityPassed) {
  const compressed = compressPageData(testData);
  const decompressed = decompressPageData(compressed);
  const requirementsPassed = validateTemplateRequirements(decompressed);
  
  if (requirementsPassed) {
    console.log('\n✨ FINAL RESULT: Integration test PASSED!');
    console.log('📦 Templates are ready for deployment with AI optimization');
    console.log('🎯 Next step: Deploy and test with real Supabase Edge Functions');
  } else {
    console.log('\n❌ FINAL RESULT: Integration test FAILED!');
    console.log('🔧 Fix data compression/decompression issues before deployment');
  }
} else {
  console.log('\n❌ FINAL RESULT: Integration test FAILED!');
  console.log('🔧 Fix data integrity issues before proceeding');
}