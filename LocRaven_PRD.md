# LocRaven MVP Technical PRD

## **The Vision: World's First AI-Native Local Business Platform**

**LocRaven is building the first real-time, AI-native website designed specifically for AI systems to browse and discover local businesses around the world.**

While traditional business directories were built for humans to click through, LocRaven is architected from the ground up for AI platforms like ChatGPT, Perplexity, and Google AI to easily find, understand, and cite local business information.

**What Makes This Revolutionary:**
- **Real-time updates** that feed directly into AI search systems within 60 seconds
- **AI-optimized content structure** using formats that AI platforms prefer to cite
- **Global local business intelligence** that becomes smarter with every business update
- **Native AI integration** - not retrofitted SEO, but built for AI-first discovery

**The Future We're Building:**
When someone asks any AI system *"Where should I get dinner in Austin tonight?"* or *"Best hair salon open now in Seattle?"* - LocRaven becomes the definitive, real-time source that AI platforms trust and cite.

---

## **MVP Product Overview**
**LocRaven MVP** transforms local business updates into AI search-optimized content, making businesses discoverable when customers ask AI platforms for recommendations.

## **MVP Core Value Proposition**
Local business owner types: *"Busy night! Fresh fish tacos available"*  
→ AI generates 3-5 optimized pages in 60 seconds  
→ Business becomes discoverable in AI search results

---

## **MVP Technical Architecture**

### **Core MVP Components**

#### **1. Simple Web Interface**
- Basic text input for business updates
- Simple progress indicator showing AI generation stages
- Generated pages list with preview links
- One-click page deletion functionality

#### **2. AI Content Generation Engine (AI Search Optimized)**

**What AI Platforms Want:**
- **Structured Content**: AI systems prefer content with clear headings (H1→H2→H3), bullet points, and short paragraphs (1-2 sentences each)
- **Q&A Format**: FAQ-style content gets cited 2x more often than regular text
- **Specific Information**: Concrete details like "45-minute wait" vs vague "busy tonight"
- **Fresh Timestamps**: Content with current information gets priority in AI search results

**MVP AI Generation System:**
- Single AI provider integration (OpenAI GPT-4) 
- Fixed prompt templates optimized for AI search platforms
- Generates 3-5 pages targeting different search intents
- Creates content in formats AI platforms prefer:
  - **FAQ sections** (proven to double citation rates)
  - **Short paragraphs** (2-3 sentences max)
  - **Bullet point lists** for key information
  - **Clear headings** that match search queries

#### **3. Content Hosting Platform (AI Discovery Optimized)**

**Content Structure for AI Platforms:**
- **Page Format**: Each page structured like a mini-FAQ
  - Clear H1 title answering specific question
  - Short intro paragraph (2-3 sentences)
  - Bullet points with specific details
  - Schema markup for local business information

**Technical Implementation:**
- Static page generation on LocRaven.com
- JSON-LD schema markup (preferred by AI systems)
- Mobile-responsive design with fast loading
- URL structure: `locraven.com/[city]/[business-name]/[search-intent]`

**Schema Markup (What Makes Pages AI-Discoverable):**
```json
// Example of what gets automatically added to each page
{
  "@type": "LocalBusiness",
  "name": "Maria's Cantina",
  "address": "Austin, TX", 
  "description": "Fresh fish tacos available tonight",
  "hasMenu": "Current specials",
  "openingHours": "Current status from update"
}
```

#### **4. AI Search Optimization Features**

**Content Templates Designed for AI Citations:**
- **Location Intent**: "Best [business type] in [city]" format
- **Service Intent**: "[Business] offers [service/product]" format  
- **Timing Intent**: "[Business] current status and availability"
- **Quality Intent**: "Why [business] is recommended in [city]"

**Format Requirements Based on AI Research:**
- **Headings**: Use descriptive H2/H3 headings that match how people search
- **Paragraphs**: Keep under 50 words, one main idea per paragraph
- **Lists**: Use bullet points for key details (hours, prices, specialties)
- **Q&A Structure**: Format content to answer "What," "When," "Where," "Why"

#### **5. Basic Analytics (AI-Focused Metrics)**
- Page creation tracking with generation success rate
- Simple view counters for each generated page  
- Basic performance metrics:
  - Which content formats get more views
  - Which search intents perform best
  - Page loading speed (important for AI crawlers)

---

## **MVP Technical Stack Requirements**

### **AI-Optimized Hybrid Architecture**

#### **Public Content (AI-First Design)**
- **Static HTML Generation:** Pre-built pages for maximum AI crawler speed
- **Server-Side Rendering:** Zero JavaScript dependencies for content
- **Edge Deployment:** Sub-200ms TTFB globally for AI platforms
- **Inline Structured Data:** JSON-LD embedded in initial HTML response

#### **Business Dashboard (Interactive)**
- **React Interface:** Interactive forms and real-time updates
- **Client-Side Features:** Content management and analytics
- **WebSocket Updates:** Live content generation status
- **Progressive Enhancement:** Works without JavaScript, enhanced with it

### **Technical Implementation**

#### **Content Delivery (AI-Optimized)**
- **Static Site Generation:** Pre-render all business pages at build time
- **Edge Hosting:** Render Static Sites or Vercel Edge for global speed
- **AI Crawler Robots.txt:** Optimized for GPTBot, ChatGPT-User, PerplexityBot
- **No Hydration Delays:** Content immediately readable by AI crawlers

#### **Backend (Essential)**
- **API Layer:** Basic REST API for dashboard functionality
- **Database:** PostgreSQL with edge caching
- **Content Pipeline:** Static generation triggered by business updates
- **Authentication:** Basic login for business dashboard only

#### **AI Integration (Core)**
- **AI Provider:** OpenAI GPT-4 API only
- **Content Processing:** Generate → Static HTML → Deploy pipeline
- **Templates:** Fixed templates optimized for AI crawler parsing
- **Output Format:** Pure HTML with embedded schema markup

---

## **MVP Features Only**

### **Essential MVP Features**
1. **Basic Business Setup**
   - Simple signup form (name, business type, location)
   - Basic profile creation
   - Category selection (restaurant, salon, etc.)

2. **Core Update Processing**
   - Single text input box
   - "Generate Content" button
   - Simple loading indicator
   - List of generated pages

3. **Content Generation**
   - 3-5 pages per update
   - Basic SEO-optimized content
   - Simple URL structure: locraven.com/[city]/[business-name]/[content-slug]
   - Basic mobile-friendly design

4. **Citation Testing & Authority Signals**
   - **Manual Citation Testing Protocol**: Test each generated page on ChatGPT, Perplexity, and Claude
   - **Authority Signal Implementation**: Add business verification badges, contact information, and source attribution
   - **Citation Performance Tracking**: Monitor which pages get cited by AI platforms
   - **Authority Content Elements**: Include business credentials, establishment dates, and local expertise indicators

5. **Basic Page Management**
   - View generated pages
   - Simple delete functionality
   - Basic page list interface

---

## **MVP Data Architecture**

### **Business Entity (Production-Ready)**
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Authentication & Billing
  google_user_id VARCHAR NOT NULL UNIQUE,
  subscription_tier VARCHAR NOT NULL, -- starter/pro/enterprise
  subscription_status VARCHAR NOT NULL, -- active/canceled/past_due
  
  -- Core Business Info (Foundation)
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL, -- restaurant/salon/bar
  address_street VARCHAR NOT NULL,
  address_city VARCHAR NOT NULL, 
  address_state VARCHAR NOT NULL,
  phone VARCHAR,
  website VARCHAR,
  
  -- Structured Business Data
  base_hours JSONB, -- {"monday": "9-17", "tuesday": "9-17"}
  services JSONB,   -- ["dine-in", "takeout", "delivery"]
  
  -- Authority Signals
  google_business_id VARCHAR, -- For verification
  established_year INTEGER,
  
  -- User Preferences  
  preview_mode_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Update Model (AI Processing)**
```sql
CREATE TABLE updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  
  -- User Input
  content_text TEXT NOT NULL, -- "Busy night! Fresh fish tacos!"
  
  -- AI Processing Status
  status VARCHAR NOT NULL, -- processing/validating/completed/failed
  ai_provider VARCHAR,     -- openai/gemini/fallback
  
  -- Content Validation Results
  validation_results JSONB, -- {stage1: "passed", stage2: "flagged", issues: []}
  processing_errors JSONB,  -- Error details if failed
  
  -- Processing Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Generated Page Model (AI Content)**
```sql
CREATE TABLE generated_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID NOT NULL REFERENCES updates(id),
  business_id UUID NOT NULL REFERENCES businesses(id),
  
  -- Page Content
  url_path VARCHAR NOT NULL, -- /austin/marias-cantina/busy-tonight
  title VARCHAR NOT NULL,
  content_html TEXT NOT NULL,
  schema_markup JSONB NOT NULL, -- JSON-LD structured data
  
  -- AI Generation Metadata
  ai_confidence_score DECIMAL(3,2), -- 0.95 = 95% confident
  content_intent VARCHAR, -- location/service/timing/quality
  
  -- Performance Tracking
  view_count INTEGER DEFAULT 0,
  citation_tests JSONB, -- Citation testing results
  
  -- Lifecycle Management
  expires_at TIMESTAMPTZ NOT NULL, -- Auto-delete after 7 days
  is_deleted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## **MVP API Endpoints (Minimal)**

### **Business Management**
```
POST /api/businesses/register     # Simple signup
GET /api/businesses/:id           # Get business info
```

### **Update Processing**
```
POST /api/updates                 # Create new update
GET /api/updates/:id              # Get processing status
```

### **Content Management**
```
GET /api/pages/:businessId        # List generated pages
DELETE /api/pages/:id             # Delete page
```

### **Basic Analytics & Citation Tracking**
```
GET /api/pages/:id/views          # Simple view count
POST /api/citation-tests          # Log manual citation test results
GET /api/citation-performance     # Track AI platform citations
GET /api/authority-signals        # Monitor authority signal effectiveness
```

---

## **MVP AI Content Generation Flow (Simplified)**

### **Basic Processing Pipeline**

#### **Stage 1: Simple Analysis (10 seconds)**
- Extract business name, type, and location from input
- Identify 3-5 basic search intents from the update
- Use basic keyword extraction

#### **Stage 2: Content Generation (30 seconds)**
- Use fixed prompts with OpenAI GPT-4
- Generate 3-5 pages with simple templates
- Focus on basic SEO content structure

#### **Stage 3: Page Creation (15 seconds)**
- Create simple HTML pages
- Apply basic schema markup
- Generate clean URLs
- Add authority signals (business credentials, contact info, timestamps)

#### **Stage 4: Static Deployment (5 seconds)**
- Generate static HTML files with inline JSON-LD
- Deploy to edge hosting (Render Static Sites)
- Update robots.txt for AI crawler access
- Queue for manual citation testing

**Total MVP Processing Time: ~60 seconds**

### **MVP Content Templates**
- **Location Page**: "[Business] in [City] - [Update]"
- **Service Page**: "[Service/Product] at [Business]"
- **Category Page**: "[Business Category] in [City] - [Business]"

---

## **MVP Performance Requirements (Basic)**

### **Response Times (AI-Optimized)**
- **Update Processing:** <60 seconds end-to-end
- **Static Page Generation:** <10 seconds from content to deployed HTML
- **AI Crawler Speed:** <200ms TTFB globally
- **Page Load Speed:** <1 second for static content, <3 seconds for dashboard
- **Content Availability:** Immediate HTML parsing for AI platforms

### **Scalability (MVP Targets)**
- **Concurrent Updates:** 10 simultaneous processing
- **Database:** 500 businesses, 5K pages
- **Traffic:** 100K page views/month
- **Uptime:** 95% availability (basic)

### **Quality Metrics (Minimal)**
- **AI Content:** Basic readability
- **Schema:** Valid but simple markup
- **Mobile:** Basic mobile-friendly design
- **Citation Rate:** Target 40-60% of pages get cited by at least one AI platform
- **Authority Score:** Basic authority signals implemented on 100% of pages

---

## **MVP Security (Basic)**

### **Essential Security**
- **HTTPS:** SSL certificates for all pages
- **Authentication:** Simple password-based login
- **Data Storage:** Basic database security
- **API Keys:** Secure OpenAI API key storage

### **Business Data (Simple)**
- **Privacy:** Basic data protection
- **Backups:** Weekly database backups
- **Access:** Business owners can only see their own data

---

## **MVP Development Plan**

### **MVP Only (Months 1-3)**
- Basic web interface
- OpenAI integration
- Simple content generation
- Basic page hosting
- 25 beta testers

**MVP Success Criteria:**
- 25 active test businesses
- <60s content generation time
- Generated pages are readable and SEO-friendly
- Basic functionality works end-to-end
- 40%+ citation rate achieved through testing protocol
- Authority signals improve AI platform trust

**NOT building in MVP:**
- Advanced analytics
- Multi-platform AI optimization  
- Payment processing
- Email notifications
- Content editing
- Performance tracking beyond basic views

---

## **MVP Technical Risks (Simplified)**

### **Error Handling & Recovery Strategy**

#### **Content Quality Protection**
- **Multi-Stage Validation**: OpenAI generates → Gemini validates → Auto-publish
- **Quality Checkpoints**: Catch inappropriate/incorrect content before publishing
- **Preview System**: Optional preview mode shows exact pages before publishing

#### **API Reliability & Backup Systems**
- **Primary Provider**: OpenAI GPT-4 for content generation
- **Backup Provider**: Google Gemini (automatic fallback if OpenAI down)
- **Fallback Templates**: Simple templates if both AI providers fail
- **Queue System**: Retry failed generations automatically

#### **Deployment Architecture** 
- **Pre-built Templates**: Static page templates with content areas
- **Content-Only Updates**: AI fills content sections, not entire pages
- **Zero Deployment Failures**: Template system eliminates deployment risks
- **Instant Publishing**: Content updates deploy in seconds

#### **User Control Features**
- **Preview Toggle**: ON/OFF setting for seeing content before publishing
- **Manual Override**: Business owners can edit AI-generated content
- **Emergency Controls**: One-click delete all today's content
- **Edit Before Publish**: Option to modify content before going live

### **Primary MVP Risks (Updated)**
1. **AI Provider Outages**
   - **Risk:** OpenAI/Gemini simultaneous downtime
   - **Mitigation:** Multi-provider backup + fallback templates + retry queue

2. **Content Accuracy**
   - **Risk:** AI generates incorrect business information
   - **Mitigation:** Multi-stage validation + human oversight + instant delete option

3. **User Adoption**
   - **Risk:** Users don't understand the value
   - **Mitigation:** Clear preview system + immediate page generation demo + easy controls

### **Acceptable MVP Limitations**
- Limited to two AI providers (OpenAI + Gemini only)
- Basic template fallbacks (no advanced content generation)
- Manual content moderation for edge cases
- No advanced performance optimization beyond template system

---

## **MVP Success Metrics (Basic)**

### **Technical MVP KPIs**
- **Processing Speed:** <60s average for content generation
- **System Reliability:** Pages generate successfully 90%+ of time
- **User Experience:** Users can complete full flow without major issues

### **Business MVP KPIs**
- **User Adoption:** 25 businesses complete onboarding
- **Usage:** 50+ content updates processed
- **Retention:** 15+ businesses return to generate more content
- **Validation:** Users say they would pay for the service

### **Quality MVP KPIs**
- **Content Readability:** Generated pages make sense and are relevant
- **Technical Functionality:** All pages load and display correctly
- **User Feedback:** Generally positive response to generated content

---

## **MVP Next Steps**

### **Immediate Actions (Week 1-2)**
1. **Choose Tech Stack** based on research recommendations
2. **Set Up Development Environment** 
3. **Create Basic Project Structure**
4. **Test OpenAI API Integration**

### **Month 1 MVP Deliverables**
- Simple web form that accepts business updates
- Working OpenAI integration that generates content
- Basic page creation and hosting
- Simple user authentication

### **Month 2-3 MVP Completion**
- Polish user interface
- Add basic page management
- Test with 10-25 real businesses
- Gather feedback for post-MVP features

**This MVP PRD focuses on proving the core concept: transforming business updates into AI-discoverable content with minimal complexity.**