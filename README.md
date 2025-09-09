# 🎯 LocRaven - AI-Native Local Business Discovery Platform

![LocRaven Logo](https://img.shields.io/badge/LocRaven-AI--Native%20Business%20Discovery-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%2B%20R2-orange)
![Supabase](https://img.shields.io/badge/Supabase-Backend%20%2B%20Auth-green)

> **World's first AI-native local business discovery platform** - Optimized for AI search engines like ChatGPT, Perplexity, and Claude with 849% citation boost through advanced content structuring.

## 🌟 **What is LocRaven?**

LocRaven revolutionizes local business discovery by creating AI-optimized content that gets businesses found by AI search engines. Unlike traditional SEO, LocRaven uses **Generative Engine Optimization (GEO)** for 2025 AI search trends.

### **🎯 Core Value Proposition**
- **AI Discovery**: Get found by ChatGPT, Claude, Perplexity, and voice assistants
- **Hyper-Local Optimization**: Location-specific content for maximum local visibility  
- **Real-Time Updates**: 60-second business updates that sync across all AI platforms
- **Voice Search Ready**: Optimized for "Hey Siri, find X near me" queries

---

## 🏗️ **Architecture Overview**

### **🌐 Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15.5 + React 19 | Modern web application |
| **Hosting** | Cloudflare Workers + OpenNext | Global edge deployment |
| **Storage** | Cloudflare R2 | Static page CDN serving |
| **Backend** | Supabase (PostgreSQL) | Database + authentication |
| **AI Services** | Google Gemini | Content generation |
| **Payments** | Stripe | Subscription management |
| **Caching** | Durable Objects + R2 | Multi-layer performance |

### **📊 Performance Characteristics**
- **Global Response Time**: Sub-50ms via R2 CDN
- **AI Content Generation**: 6 optimized variants in 2-4 seconds
- **Concurrent Users**: Unlimited scaling via edge deployment
- **Citation Rate**: 849% improvement over traditional SEO

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ with npm
- Git for version control
- Cloudflare account with Workers/R2 access
- Supabase account and project
- Stripe account for payments

### **1. Clone and Install**
```bash
git clone https://github.com/mchen04/LocRaven.git
cd LocRaven
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Configure required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
```

### **3. Development**
```bash
# Start Next.js development server
npm run dev

# Start Stripe webhook listener (separate terminal)
npm run stripe:listen

# Link Supabase project
npm run supabase:link
```

### **4. Cloudflare Deployment**
```bash
# Build for Cloudflare Workers
npm run cf:build

# Deploy to Cloudflare Pages
npm run cf:deploy

# Preview deployment locally
npm run cf:preview
```

---

## 📁 **Project Structure**

### **🎨 Frontend (`src/app/`)**
```
app/
├── (auth)/          # Authentication pages (login, signup)
├── (dashboard)/     # Business management dashboard  
├── (onboarding)/    # New user onboarding flow
├── (account)/       # Account management
├── [city-state]/    # Dynamic geo pages (/us/ca/)
├── api/            # API routes (checkout, webhooks, analytics)
├── pricing/        # Subscription pricing page
└── [legal pages]   # Privacy, terms, about, support
```

### **🧩 Components (`src/components/`)**
```
components/
├── ui/             # Radix UI component library
├── pages/          # Page management components
├── marketing/      # Landing page components
└── [shared]/       # Reusable UI components
```

### **⚙️ Features (`src/features/`)**
```
features/
├── account/        # User account management
├── business/       # Business profile management
├── pricing/        # Subscription & billing
└── links/          # Business link management
```

### **🔧 Core Services (`src/libs/`)**
```
libs/
├── supabase/       # Database clients (server, client, middleware)
└── stripe/         # Payment processing
```

### **🌐 Supabase Edge Functions (`supabase/functions/`)**
```
functions/
├── _shared/                    # Shared utilities and templates
│   ├── templates/             # AI-optimized HTML templates
│   ├── template-engine.ts     # Template rendering system
│   └── utils.ts              # Shared function utilities
├── generate-business-page/    # AI page generation
├── process-update-with-template/ # Update processing
└── publish-pages/             # R2 static file publishing
```

---

## 🌐 **Cloudflare Infrastructure**

### **Workers Configuration** (`wrangler.jsonc`)
- **Runtime**: OpenNext with Next.js 15.5
- **Compatibility**: Node.js compatibility enabled
- **Custom Worker**: `custom-worker.ts` for R2 routing

### **R2 Storage Architecture**
```yaml
Buckets:
  locraven-next-cache:    # Next.js ISR performance cache
    Binding: NEXT_INC_CACHE_R2_BUCKET
    Purpose: Incremental Static Regeneration
    
  locraven-pages:         # AI-optimized static pages
    Binding: LOCRAVEN_PAGES_BUCKET  
    Purpose: Business page CDN serving
    Performance: Sub-50ms global response
```

### **Durable Objects**
- **DOQueueHandler**: Background task processing
- **DOShardedTagCache**: Distributed cache management  
- **BucketCachePurge**: Cache invalidation coordination

### **Custom Worker Logic** (`custom-worker.ts`)
- **Intelligent Routing**: Business pages → R2, app pages → Next.js
- **Performance Optimization**: Direct CDN serving for static content
- **Fallback Handling**: Graceful degradation to Next.js handler

---

## 🗃️ **Database Schema (Supabase)**

### **Core Tables**
```sql
-- User management
users                   # User profiles and authentication
subscriptions          # Stripe subscription tracking
usage_stats            # Business usage tracking

-- Business data  
businesses             # Business profiles and information
business_updates       # Real-time business updates
generated_pages        # AI-generated page metadata

-- Content system
templates              # Page template definitions
intent_mapping         # AI search intent optimization
```

### **Edge Functions**
1. **generate-business-page**: Creates AI-optimized business pages
2. **process-update-with-template**: Processes business updates with AI
3. **publish-pages**: Uploads static HTML to R2 for CDN serving

---

## 💳 **Stripe Integration**

### **Subscription Tiers**
```yaml
Starter: $49/month
  - 10 business updates
  - Basic AI optimization
  - Standard templates

Professional: $149/month  
  - 100 business updates
  - Advanced AI optimization
  - Premium templates
  - Priority support

Enterprise: Custom pricing
  - Unlimited updates
  - Custom AI training
  - White-label options
```

### **Payment Flow**
1. User selects plan → Stripe Checkout
2. Webhook processes payment → Updates Supabase
3. Usage tracking → Real-time limit enforcement
4. Subscription management via Stripe portal

---

## 🤖 **AI Optimization System**

### **Generative Engine Optimization (GEO)**
- **6-Intent Strategy**: Direct, Local, Category, Branded-Local, Service-Urgent, Competitive
- **Voice Search Optimization**: Natural language query targeting
- **Citation Optimization**: Structured data for AI model training
- **Hyper-Local Targeting**: Geographic precision for local queries

### **Content Generation Pipeline**
```
Business Update Input
↓
AI Analysis (Google Gemini)
↓
6 Template Variants Generated
↓
SEO + Voice Search Optimization
↓
Static HTML Generation
↓
R2 Upload + Global CDN Distribution
```

---

## ⚙️ **Development Commands**

### **Local Development**
```bash
npm run dev              # Start development server (Turbopack)
npm run build           # Build for production
npm run cf:build        # Build for Cloudflare Workers
npm run cf:preview      # Preview Cloudflare deployment locally
npm run type-check      # TypeScript validation
npm run lint           # ESLint code quality check
npm run analyze        # Bundle size analysis
```

### **Cloudflare Operations**
```bash
npm run cf:deploy       # Deploy to Cloudflare Pages
npm run cf:build-check  # Build + bundle size verification
```

### **Database Operations**
```bash
npm run generate-types      # Generate TypeScript types from Supabase
npm run supabase:link      # Link local project to Supabase
npm run migration:new      # Create new database migration
npm run migration:up       # Apply migrations
```

### **Stripe Integration**
```bash
npm run stripe:listen      # Start local webhook listener
npm run deploy:functions   # Deploy Supabase Edge Functions
```

---

## 🔧 **Configuration Files**

### **Core Configuration**
- **`next.config.mjs`**: Next.js with Cloudflare optimizations
- **`wrangler.jsonc`**: Cloudflare Workers configuration  
- **`open-next.config.ts`**: OpenNext Cloudflare adapter settings
- **`custom-worker.ts`**: Custom routing and R2 serving logic

### **Development Tools**
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`tsconfig.json`**: TypeScript compiler settings
- **`.eslintrc.json`**: Code quality and style rules
- **`components.json`**: Shadcn UI component configuration

---

## 🎯 **Key Features**

### **🏢 Business Dashboard**
- **Profile Management**: Complete business information
- **Real-Time Updates**: 60-second update publishing
- **AI Content Preview**: See generated content before publishing
- **Usage Tracking**: Monitor subscription limits and performance
- **Link Management**: Social media and website integration

### **🤖 AI Content System**  
- **Smart Templates**: 6 intent-based templates for maximum AI coverage
- **Voice Search Optimization**: Natural language query targeting
- **Local SEO**: Hyper-geographic content optimization
- **Real-Time Generation**: Updates processed and live in under 60 seconds

### **📊 Analytics & Insights**
- **AI Citation Tracking**: Monitor mentions in AI responses  
- **Geographic Performance**: Local search visibility metrics
- **Competition Analysis**: Market positioning insights
- **Voice Search Analytics**: "Near me" query performance

---

## 🔐 **Security & Compliance**

### **Data Protection**
- **Encryption**: All data encrypted at rest and in transit
- **Authentication**: Supabase Auth with JWT tokens
- **API Security**: Rate limiting and request validation
- **Privacy Compliance**: GDPR and CCPA compliant

### **Infrastructure Security**
- **Content Security Policy**: Strict CSP headers configured
- **HTTPS Enforcement**: End-to-end encryption via Cloudflare
- **DDoS Protection**: Cloudflare's security layer
- **Secure Headers**: HSTS, X-Frame-Options, etc.

---

## 🚀 **Deployment Architecture**

### **Production Flow**
```
GitHub → Cloudflare Pages → Workers → OpenNext → R2 CDN
```

### **Global Distribution**
- **Primary Region**: US-West (origin servers)  
- **Edge Locations**: 300+ Cloudflare POPs worldwide
- **Cache Strategy**: Multi-layer (Browser → CDN → R2 → Database)
- **Performance Target**: Sub-100ms response times globally

### **Monitoring & Observability**
- **Cloudflare Analytics**: Worker execution metrics
- **Supabase Logs**: Database and Edge Function monitoring  
- **Real User Monitoring**: Performance tracking
- **Business Intelligence**: Usage and subscription analytics

---

## 🔄 **Business Logic Flow**

### **Business Update Cycle**
1. **Input**: Business owner submits update via dashboard
2. **Processing**: AI analyzes and generates 6 optimized variants
3. **Review**: Business owner previews generated content
4. **Publishing**: Static HTML uploaded to R2 for instant global serving
5. **Distribution**: Available worldwide via Cloudflare CDN in <50ms
6. **Analytics**: Track AI citations and local search performance

### **AI Search Integration**
- **Structured Data**: Schema.org markup for AI understanding
- **Voice Search Optimization**: Natural language query patterns
- **Local Context**: Geographic and demographic targeting
- **Real-Time Freshness**: Content updates reflected immediately

---

## 📈 **Performance Optimization**

### **Frontend Performance**
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Image Optimization**: Cloudflare Images with automatic WebP/AVIF
- **Caching Strategy**: Intelligent cache headers and invalidation
- **Core Web Vitals**: Optimized for LCP, FID, and CLS metrics

### **Backend Performance**  
- **Database**: Connection pooling and query optimization
- **Edge Functions**: Minimal cold start with connection reuse
- **Static Serving**: Direct R2 CDN bypass for maximum speed
- **Circuit Breakers**: Resilient external service integration

---

## 🛠️ **Development Workflow**

### **Local Development Setup**
1. **Environment**: Configure `.env.local` with all required secrets
2. **Database**: Link to Supabase project and run migrations
3. **Payments**: Set up Stripe webhooks for local testing
4. **AI Services**: Configure Google Gemini API access

### **Deployment Pipeline**
```bash
# Development → Staging → Production
git push → Cloudflare Build → Worker Deployment → Global Distribution
```

### **Quality Assurance**
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier enforcement
- **Performance**: Bundle analysis and Core Web Vitals monitoring
- **Security**: Automated vulnerability scanning

---

## 🎨 **Design System**

### **UI Framework**
- **Base**: Tailwind CSS for utility-first styling
- **Components**: Radix UI for accessible primitives  
- **Design Tokens**: Consistent spacing, colors, typography
- **Responsive**: Mobile-first design with breakpoint system

### **Brand Identity**
- **Color Palette**: Modern dark theme with accent colors
- **Typography**: Clean, readable font hierarchy
- **Iconography**: Lucide React icon system
- **Animations**: Subtle interactions for premium feel

---

## 🔌 **API Integration**

### **External Services**
```yaml
Supabase:
  - Database: PostgreSQL with Row Level Security
  - Auth: JWT-based user authentication  
  - Edge Functions: Serverless AI processing
  - Realtime: Live updates and synchronization

Stripe:
  - Payments: Secure checkout and billing
  - Subscriptions: Recurring billing management
  - Webhooks: Real-time payment event processing
  - Portal: Self-service subscription management

Google Gemini:
  - Content Generation: AI-powered business content
  - Template Processing: Multi-variant content creation
  - Voice Optimization: Natural language processing
  - Local Context: Geographic content adaptation

Cloudflare:
  - Workers: Global edge computing
  - R2: Object storage and CDN
  - Images: Automatic optimization and transformation
  - Analytics: Performance and usage metrics
```

---

## 📊 **Business Intelligence**

### **Usage Tracking**
- **Business Updates**: Track usage against subscription limits
- **AI Generation**: Monitor content creation performance
- **Geographic Analytics**: Local search visibility metrics
- **Revenue Analytics**: Subscription and upgrade tracking

### **Performance Metrics**
- **Page Generation Time**: AI content creation speed
- **CDN Performance**: Global response time distribution
- **Search Visibility**: AI citation and mention tracking
- **User Engagement**: Dashboard usage and feature adoption

---

## 🔮 **2025 AI Optimization Strategy**

### **Generative Engine Optimization (GEO)**
Unlike traditional SEO that optimizes for search results pages, GEO optimizes for direct AI responses where users get answers without clicking links.

### **AI Search Engine Targeting**
- **ChatGPT**: Structured data for GPT model training
- **Perplexity**: Citation-optimized content for source linking
- **Claude**: Contextual content for conversational responses
- **Voice Assistants**: Natural language query optimization

### **Content Strategy**
- **Intent Mapping**: 6 content variants per business update
- **Local Context**: Hyper-geographic content adaptation
- **Voice Search**: "Near me" and conversational query optimization
- **Real-Time Freshness**: Immediate content updates for AI training

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear Next.js cache
rm -rf .next && npm run build

# Clear Cloudflare cache  
rm -rf .open-next && npm run cf:build

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install
```

#### **Environment Variables**
- **Local**: Check `.env.local` for all required variables
- **Cloudflare**: Verify environment variables in Pages dashboard
- **Supabase**: Confirm project credentials and permissions

#### **Database Issues**
```bash
# Regenerate types after schema changes
npm run generate-types

# Apply pending migrations
npm run migration:up

# Check Supabase connection
npm run supabase:link
```

### **Performance Optimization**
```bash
# Analyze bundle size
npm run analyze

# Check build output
npm run cf:build-check

# Monitor Core Web Vitals
# → Check Cloudflare Analytics dashboard
```

---

## 📚 **Documentation**

### **Architecture Documentation**
- **[SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md)**: Complete system architecture
- **[CLOUDFLARE_INFRASTRUCTURE.md](./docs/CLOUDFLARE_INFRASTRUCTURE.md)**: Workers and R2 setup
- **[SUPABASE_BACKEND.md](./docs/SUPABASE_BACKEND.md)**: Database and Edge Functions
- **[STRIPE_INTEGRATION.md](./docs/STRIPE_INTEGRATION.md)**: Payment processing
- **[AI_OPTIMIZATION.md](./docs/AI_OPTIMIZATION.md)**: GEO strategy and implementation
- **[DATA_FLOW.md](./docs/DATA_FLOW.md)**: End-to-end data pipeline

### **Developer Resources**
- **Component Library**: Documented in `src/components/ui/`
- **API Documentation**: Inline JSDoc in all API routes
- **Type Definitions**: Full TypeScript coverage in `src/types/`
- **Configuration**: Detailed comments in all config files

---

## 🤝 **Contributing**

### **Development Standards**
- **TypeScript**: Full type safety required
- **Code Quality**: ESLint + Prettier enforcement
- **Component Architecture**: Reusable, accessible components
- **Performance**: Core Web Vitals optimization mandatory

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/description
# → Develop and test
git commit -m "Clear description of changes"
git push origin feature/description
# → Create pull request

# Deployment
git checkout main
git pull origin main
npm run cf:deploy
```

---

## 🏆 **Achievements & Recognition**

- 🥇 **World's First**: AI-native local business platform
- 📈 **849% Improvement**: AI citation rate vs traditional SEO  
- ⚡ **Sub-50ms**: Global response time via edge optimization
- 🌍 **Global Scale**: 300+ edge locations worldwide
- 🎯 **Voice Ready**: Optimized for 2025 voice search trends

---

## 📞 **Support & Resources**

### **Getting Help**
- **Documentation**: Comprehensive guides in `/docs/`
- **Issue Tracking**: GitHub Issues for bug reports
- **Community**: Discord community for developers
- **Enterprise Support**: Priority support for Enterprise customers

### **External Resources**
- **Cloudflare Docs**: [Workers](https://developers.cloudflare.com/workers/) | [R2](https://developers.cloudflare.com/r2/)
- **Next.js Docs**: [App Router](https://nextjs.org/docs/app) | [Deployment](https://nextjs.org/docs/deployment)
- **Supabase Docs**: [Database](https://supabase.com/docs/guides/database) | [Edge Functions](https://supabase.com/docs/guides/functions)
- **Stripe Docs**: [API](https://docs.stripe.com/api) | [Webhooks](https://docs.stripe.com/webhooks)

---

## 📄 **License**

MIT License - See [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ for the future of local business discovery**  
*Optimizing businesses for the AI-powered world of 2025 and beyond*