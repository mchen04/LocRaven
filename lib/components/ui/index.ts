// === MAIN UI COMPONENT LIBRARY INDEX ===
// Consolidated and optimized component exports

// === ATOMIC DESIGN SYSTEM EXPORTS ===
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';
export * from './layouts';

// === ADVANCED PATTERNS ===
export * from './compounds';
// Note: Patterns temporarily disabled for build stability
// export * from './patterns';

// === UTILITY EXPORTS ===
export * from './utils';
// Selective export from types to avoid conflicts
export type {
  BaseComponentProps,
  StandardComponentProps,
  InteractiveComponentProps,
  FormComponentProps,
  LayoutComponentProps,
  AnimatedComponentProps,
  TableColumn,
  PaginationProps,
  AriaProps
} from './types/common';

// === CONVENIENCE RE-EXPORTS ===
// Most commonly used components for easy importing

// Core atoms
export {
  Button,
  Input, 
  Card,
  Loading
} from './atoms';

// Essential molecules  
export {
  FormField,
  FormSection,
  Select,
  CheckboxGroup,
  TagInput,
  SearchInput
} from './molecules';

// Key organisms
export {
  Modal,
  BusinessSection,
  type FieldConfig
} from './organisms';

// Advanced composition patterns
export {
  Form,
  FormActions,
  FormGroup
} from './compounds';

// Advanced patterns temporarily disabled for build stability
// export {
//   useFormState,
//   withValidation,
//   useValidatedForm,
//   type ValidationRule,
//   type ValidationProps
// } from './patterns';

// export {
//   RenderProps
// } from './patterns/RenderProps';