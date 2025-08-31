// Comprehensive UI Component Library Index
// Consolidates all refactored UI components with standardized interfaces

// === ATOMS (Basic UI Elements) ===
export * from './atoms';

// === MOLECULES (Composite Components) ===
export * from './molecules';

// === ORGANISMS (Complex Components) ===
export * from './organisms';

// === TEMPLATES (Layout Components) ===
export * from './templates';

// === LAYOUTS (Page-level Layouts) ===
export * from './layouts';

// === UTILITIES (Helper Components) ===
export * from './utils';

// === TYPES (Interface Definitions) ===
export * from './types/common';

// === CONVENIENCE RE-EXPORTS ===

// Most commonly used refactored components
export {
  Loading,
  FormDisplay
} from './atoms';

export {
  FormField as FormFieldRefactored,
  FormSection as FormSectionRefactored
} from './molecules';

export {
  Modal as ModalRefactored,
  ConfirmationModal,
  BusinessSection,
  type FieldConfig,
  type BusinessSectionProps
} from './organisms';

export {
  FlexCenter,
  FlexBetween,
  GridResponsive,
  Container,
  Section,
  FadeIn,
  SlideUp,
  SkeletonLoader,
  Heading,
  Text,
  Label,
  Link
} from './utils';

// Common interface patterns
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
  PaginationProps
} from './types/common';