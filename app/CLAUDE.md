# LocRaven App Router Pages - Next.js 15

*Next.js App Router page components and routing patterns for LocRaven business platform.*

## App Router Architecture

**Location**: `/app/`
**Framework**: Next.js 15.5.0 App Router
**Purpose**: File-based routing with server-side rendering for SEO optimization

### Route Structure
```
app/
├── layout.tsx                 # Root layout with providers and metadata
├── page.tsx                   # Landing page (/)
├── (auth)/                    # Route group for authentication
│   ├── login/page.tsx         # Login page (/login)
│   └── auth/callback/page.tsx # OAuth callback (/auth/callback)
├── chat/page.tsx             # AI chat interface (/chat)
├── dashboard/page.tsx        # Business dashboard (/dashboard)
└── [country]/[state]/[city]/[business]/[[...slug]]/page.tsx  # Dynamic business pages
```

## Page Component Patterns

### Landing Page (`/`)
- **Server Component**: Default server rendering for SEO with simplified big tech design patterns
- **Metadata**: Comprehensive SEO metadata in layout.tsx
- **Styling**: Completely redesigned LandingPage.css following Apple/Linear/Notion minimalist patterns
- **Navigation**: Simplified navigation with only essential links (Pricing, Get Started)
- **Professional Design**: Clean layout with 4 focused sections (Hero, How It Works, Pricing, CTA)

### Authentication Pages
- **Route Group**: `(auth)` for clean URL structure
- **Protected Logic**: ProtectedPageWrapper HOC for authenticated routes
- **OAuth Flow**: Google authentication via Supabase Auth
- **Redirects**: URL preservation for post-login navigation

### Protected Routes
- **Wrapper Pattern**: ProtectedPageWrapper HOC around page content
- **Authentication Check**: Client-side auth validation with loading states
- **Dynamic Rendering**: `export const dynamic = 'force-dynamic'` for auth pages

### Dynamic Routes
- **Business Pages**: SEO-optimized routes with geographic hierarchy
- **Catch-All Routes**: `[[...slug]]` for flexible business page content
- **Static Generation**: Pre-rendered for performance where possible

## Integration Patterns

### Layout Composition
- **Root Layout**: AuthProvider and BusinessProvider in app/layout.tsx
- **Dark Theme**: data-theme="dark" for consistent styling
- **Global Imports**: CSS and context providers at root level

### Component Integration
- **Library Imports**: Components from `/lib/components/`
- **Path Aliases**: `@/lib/*` for clean import paths
- **Feature Organization**: Import from feature directories

### Authentication Flow
```typescript
// Protected page pattern
export default function ProtectedPage() {
  return (
    <ProtectedPageWrapper>
      <YourPageContent />
    </ProtectedPageWrapper>
  );
}
```

### Development Workflow
- **Hot Reload**: Next.js Fast Refresh during development
- **Type Safety**: Full TypeScript integration
- **Build Optimization**: Static generation where possible

---

*This documentation reflects the Next.js 15 App Router architecture for LocRaven's business platform.*