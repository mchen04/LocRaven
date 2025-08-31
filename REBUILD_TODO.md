# LocRaven UI Rebuild TODO

## Tech Stack
- **Next.js 15+** (App Router)
- **React 19** 
- **TypeScript 5.6+**
- **Tailwind CSS 4.0**
- **shadcn/ui** component library
- **Supabase** (with MCP integration)

---

## UI Flow Structure

### Pages & Routes
- **Landing Page** (`/`) → **Login** (`/login`) → **Dashboard** (`/dashboard`)

### Dashboard Views (Single Page App with Sidebar)
- **Update** (default): Create business updates form
- **Profile**: Business details form 
- **Links**: Active/expired pages management
- **Analytics**: Individual page performance
- **Subscription**: Billing/plan management  
- **Settings**: Account info + danger zone

---

## State Management Architecture

### Global State (React 19 Context + Custom Hooks)

#### Core Contexts
```typescript
// AuthContext - Global auth state
interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// BusinessContext - Global business data
interface BusinessContextType {
  business: Business | null;
  updateBusiness: (data: BusinessData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// NotificationContext - Global notifications (NEW)
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  dismissAll: () => void;
}
```

#### Feature-Specific Hooks
```typescript
// Data fetching hooks
usePages(): { pages, activePages, expiredPages, refreshPages, deletePage }
useUpdates(): { updates, loading, error }
useStats(): { totalPages, updatesToday, activePages }

// Form management hooks  
useUpdateForm(): { updateText, dates, processing, validation, submit }
useDashboardUI(): { sidebarOpen, setSidebarOpen }
```

#### URL-Based State (Next.js Router)
```typescript
// Replace local state with URL params
selectedPage → /dashboard?page=analytics&pageId=123
viewMode → /dashboard/profile, /dashboard/links, etc.
```

---

## Component Architecture (shadcn/ui Based)

### Directory Structure
```
/app
├── (auth)/
│   └── login/page.tsx
├── dashboard/
│   ├── layout.tsx                 # Dashboard layout with sidebar
│   ├── page.tsx                   # Update view (default)
│   ├── profile/page.tsx           # Profile view
│   ├── links/page.tsx             # Links view
│   ├── analytics/page.tsx         # Analytics view
│   ├── subscription/page.tsx      # Subscription view
│   └── settings/page.tsx          # Settings view
├── page.tsx                       # Landing page
└── layout.tsx                     # Root layout

/components
├── ui/                           # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── form.tsx
│   ├── toast.tsx
│   ├── alert.tsx
│   ├── data-table.tsx
│   ├── badge.tsx
│   └── ...
├── dashboard/
│   ├── sidebar.tsx
│   ├── update-form.tsx
│   ├── business-profile-form.tsx
│   ├── pages-list.tsx
│   ├── analytics-chart.tsx
│   └── subscription-plans.tsx
├── landing/
│   ├── hero-section.tsx
│   ├── stats-grid.tsx
│   ├── founders-section.tsx
│   └── pricing-cards.tsx
└── providers/
    ├── auth-provider.tsx
    ├── business-provider.tsx
    └── notification-provider.tsx
```

---

## Implementation TODO

### Phase 1: Foundation Setup (Week 1)

#### Tech Stack Setup
- [ ] Initialize Next.js 15 with TypeScript 5.6+
- [ ] Install and configure Tailwind CSS 4.0
- [ ] Setup shadcn/ui component library
- [ ] Configure Supabase client with MCP integration
- [ ] Setup ESLint + Prettier for code formatting

#### Core Components (shadcn/ui)
- [ ] Install base shadcn components: `button`, `card`, `input`, `form`
- [ ] Install navigation components: `navigation-menu`, `sidebar`
- [ ] Install feedback components: `toast`, `alert`, `badge`
- [ ] Install data components: `table`, `skeleton`, `empty-state`
- [ ] Configure dark mode support

### Phase 2: Authentication & Layout (Week 2)

#### Authentication System
- [ ] Create AuthProvider with React 19 context
- [ ] Implement Supabase Auth (Google OAuth)
- [ ] Build login page with shadcn form components
- [ ] Add protected route wrapper
- [ ] Handle auth loading and error states

#### Dashboard Layout
- [ ] Build responsive sidebar with shadcn navigation
- [ ] Create dashboard layout with proper routing
- [ ] Implement view switching (URL-based routing)
- [ ] Add mobile-responsive sidebar collapse

### Phase 3: Core Dashboard Views (Week 3)

#### Update View (Default Dashboard)
- [ ] Create UpdateForm component with shadcn forms
- [ ] Implement useUpdateForm custom hook
- [ ] Add form validation with zod
- [ ] Build stats cards display
- [ ] Add processing states and feedback

#### Profile View  
- [ ] Create BusinessProfileForm with multi-section layout
- [ ] Implement business data CRUD operations
- [ ] Add form persistence and auto-save
- [ ] Build profile completion tracking

#### Links View
- [ ] Create PagesDataTable with shadcn table
- [ ] Implement active/expired tabs
- [ ] Add search and filtering functionality
- [ ] Build page management actions (delete, edit)

### Phase 4: Advanced Views (Week 4)

#### Analytics View
- [ ] Create individual page analytics display
- [ ] Add charts for page performance
- [ ] Implement analytics data fetching
- [ ] Build comparison and trend views

#### Subscription View
- [ ] Create subscription status display
- [ ] Build plan comparison cards
- [ ] Integrate Stripe billing portal
- [ ] Add usage tracking display

#### Settings View  
- [ ] Create account information display
- [ ] Add export/import functionality
- [ ] Build danger zone with confirmations
- [ ] Implement account deletion flow

### Phase 5: Landing Page Rebuild (Week 5)

#### Landing Page Components
- [ ] Create HeroSection with shadcn components
- [ ] Build StatsGrid with animated counters
- [ ] Create FoundersSection with team cards
- [ ] Build PricingCards with feature comparison
- [ ] Add proper call-to-action flows

### Phase 6: Optimization & Polish (Week 6)

#### Performance Optimizations
- [ ] Add React.memo to all presentational components
- [ ] Implement code splitting with React.lazy
- [ ] Add loading skeletons for all data fetching
- [ ] Optimize images and assets
- [ ] Add proper error boundaries

#### UX Improvements
- [ ] Replace alert() with toast notifications
- [ ] Add optimistic updates for better perceived performance
- [ ] Implement proper loading states
- [ ] Add keyboard shortcuts for power users
- [ ] Build offline support indicators

#### Accessibility
- [ ] Add proper ARIA labels and roles
- [ ] Implement focus management for navigation
- [ ] Add screen reader announcements
- [ ] Test with keyboard navigation
- [ ] Ensure proper color contrast ratios

---

## Best Practices Implementation

### React 19 Patterns
- [ ] Use new `use()` hook for data fetching
- [ ] Implement React Server Components where appropriate  
- [ ] Use concurrent features (startTransition, useDeferredValue)
- [ ] Leverage new form actions and form state

### State Management Best Practices
- [ ] Single Responsibility: Each hook/context has one purpose
- [ ] Container/Presentational: Separate logic from UI components
- [ ] URL State: Use Next.js router for shareable state
- [ ] Optimistic Updates: Show immediate feedback before API calls
- [ ] Error Boundaries: Graceful error handling at component level

### Component Architecture Best Practices  
- [ ] Atomic Design: Build from atoms → molecules → organisms
- [ ] Composition over Inheritance: Use component composition
- [ ] Props Interface Design: Clear, typed component APIs
- [ ] Render Props Pattern: For complex state sharing
- [ ] Custom Hooks: Extract and reuse stateful logic

### TypeScript Best Practices
- [ ] Strict mode enabled with proper type safety
- [ ] Interface segregation for component props
- [ ] Generic types for reusable components  
- [ ] Discriminated unions for state variants
- [ ] Proper error type handling

### Tailwind + shadcn/ui Best Practices
- [ ] Design tokens: Consistent color, spacing, typography system
- [ ] Component variants: Use CVA for component variations
- [ ] Responsive design: Mobile-first approach
- [ ] Dark mode: Proper theme switching support
- [ ] Accessibility: Use shadcn's built-in a11y features

### Supabase Integration Best Practices
- [ ] Row Level Security (RLS) for all tables
- [ ] Type generation for database schemas
- [ ] Real-time subscriptions for live updates
- [ ] Edge functions for complex business logic
- [ ] Proper error handling for database operations

---

## Component Reusability Patterns

### Compound Components
```typescript
// Example: DataTable with composable parts
<DataTable data={pages}>
  <DataTable.Header>
    <DataTable.Search />
    <DataTable.Filter />
  </DataTable.Header>
  <DataTable.Body>
    <DataTable.Row />
  </DataTable.Body>
  <DataTable.Pagination />
</DataTable>
```

### Render Props Pattern
```typescript
// Example: Resource loader with flexible rendering
<ResourceLoader resource="pages">
  {({ data, loading, error }) => (
    loading ? <Skeleton /> : <PagesList pages={data} />
  )}
</ResourceLoader>
```

### Custom Hook Pattern
```typescript
// Example: Reusable form state management
const useFormState = <T>(initialValues: T) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return { values, errors, isSubmitting, handleChange, handleSubmit };
};
```

---

## Success Metrics

### Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s  
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size < 500KB (initial load)

### Code Quality Targets
- [ ] TypeScript strict mode with 0 any types
- [ ] ESLint + Prettier with 0 warnings
- [ ] 100% component test coverage for utilities
- [ ] Accessibility score 95+ (Lighthouse)
- [ ] SEO score 95+ (Lighthouse)

### UX Quality Targets
- [ ] All user actions provide immediate feedback
- [ ] No loading states longer than 2 seconds
- [ ] All forms have proper validation
- [ ] Error messages are actionable and clear
- [ ] Keyboard navigation works on all features

---

## File Generation Checklist

### Configuration Files
- [ ] `next.config.js` - Next.js 15 configuration
- [ ] `tailwind.config.ts` - Tailwind 4.0 with shadcn theme
- [ ] `components.json` - shadcn/ui configuration  
- [ ] `tsconfig.json` - TypeScript 5.6+ strict configuration
- [ ] `.eslintrc.json` - Code quality rules

### Type Definitions
- [ ] `types/index.ts` - Global type definitions
- [ ] `types/database.ts` - Supabase generated types
- [ ] `types/components.ts` - Component prop types

### Utility Files
- [ ] `lib/utils.ts` - Utility functions (cn, formatters, etc.)
- [ ] `lib/supabase.ts` - Supabase client configuration
- [ ] `lib/validations.ts` - Zod schemas for form validation

This rebuild will create a modern, scalable, and maintainable UI architecture following 2025 React best practices.