// === COMPREHENSIVE TYPE SYSTEM ===
// Complete type system for the component library

// === BASIC TYPES ===
// Common component interfaces and basic patterns
export * from './common';

// === ADVANCED TYPES ===
// Temporarily disabled for build stability
// export * from './advanced';
// export * from './strict';

// === CONVENIENCE RE-EXPORTS ===
// Most commonly used types

// From common
export type {
  BaseComponentProps,
  StandardComponentProps,
  InteractiveComponentProps,
  FormComponentProps,
  LayoutComponentProps,
  AnimatedComponentProps,
  SelectOption,
  CheckboxOption,
  TableColumn,
  PaginationProps,
  AriaProps,
} from './common';

// Advanced types temporarily disabled for build stability