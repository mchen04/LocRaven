// === COMMON COMPONENT TYPES ===
// Standardized component interface patterns for consistent props across all components
// For advanced patterns, see ./advanced.ts and ./strict.ts

export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface SizeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface VariantProps<T extends string> {
  variant?: T;
}

export interface ColorProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'white';
}

export interface DisabledProps {
  disabled?: boolean;
}

export interface LoadingStateProps {
  loading?: boolean;
}

export interface FullWidthProps {
  fullWidth?: boolean;
}

// Form-specific interfaces
export interface FormFieldBaseProps extends BaseComponentProps {
  id?: string;
  name?: string;
  required?: boolean;
  error?: string | boolean;
  helpText?: string;
  label?: string;
}

export interface FormControlProps extends FormFieldBaseProps, DisabledProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
}

// Layout interfaces
export interface SpacingProps {
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface FlexProps {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface GridProps {
  columns?: number | 'auto';
  rows?: number | 'auto';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Interactive interfaces
export interface ClickableProps {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
}

export interface FocusableProps {
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  autoFocus?: boolean;
  tabIndex?: number;
}

export interface HoverableProps {
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// Animation interfaces
export interface AnimationProps {
  animate?: boolean;
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export interface TransitionProps {
  transition?: 'none' | 'all' | 'colors' | 'opacity' | 'shadow' | 'transform';
}

// Modal/Overlay interfaces
export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  preventBodyScroll?: boolean;
}

export interface PositionProps {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
}

// Accessibility interfaces
export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-pressed'?: boolean;
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  role?: string;
}

// Theme interfaces
export interface ThemeProps {
  theme?: 'light' | 'dark' | 'auto';
}

export interface BorderProps {
  border?: boolean | 'none' | 'sm' | 'md' | 'lg';
  borderColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ShadowProps {
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Compound interface types for common combinations
export interface StandardComponentProps extends BaseComponentProps, ChildrenProps, SizeProps, DisabledProps {}

export interface InteractiveComponentProps extends StandardComponentProps, ClickableProps, FocusableProps, HoverableProps, AriaProps {}

export interface FormComponentProps extends FormControlProps, SizeProps, VariantProps<'default' | 'error' | 'success'>, FullWidthProps {}

export interface LayoutComponentProps extends BaseComponentProps, ChildrenProps, SpacingProps, BorderProps, ShadowProps {}

export interface AnimatedComponentProps extends BaseComponentProps, ChildrenProps, AnimationProps, TransitionProps {}

// Option interfaces for select/choice components
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioOption extends CheckboxOption {}

export interface TabOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

// Data table interfaces
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableRow<T = any> {
  id: string | number;
  data: T;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

// Status and state interfaces
export interface StatusProps {
  status?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
}

export interface ProgressProps {
  progress?: number; // 0-100
  indeterminate?: boolean;
}

// File upload interfaces
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  onFileSelect?: (files: File[]) => void;
  onError?: (error: string) => void;
}

// Search and filter interfaces
export interface SearchProps {
  searchTerm?: string;
  onSearch?: (term: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  debounceMs?: number;
}

export interface FilterProps<T = any> {
  filters?: T;
  onFilterChange?: (filters: T) => void;
  clearable?: boolean;
}

// Pagination interfaces
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  showTotal?: boolean;
  totalItems?: number;
}

// Responsive interfaces
export interface ResponsiveProps<T = any> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export interface BreakpointProps {
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}