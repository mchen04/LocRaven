// === MAIN COMPONENT LIBRARY INDEX ===
// Primary entry point for all components

// === UI DESIGN SYSTEM (ATOMIC DESIGN) ===
// Complete UI component library with atoms, molecules, organisms
export * from './ui';

// === FEATURE COMPONENTS ===  
// Business logic and app-specific components
export * from './features';

// === LAYOUT COMPONENTS ===
// Page-level and structural components
export * from './layouts';

// === ALL LEGACY COMPONENTS REMOVED ===
// Successfully migrated to modern UI system components

// === CONVENIENCE RE-EXPORTS ===
// Most commonly used components for easy importing
export {
  // Core UI Components
  Button,
  Input,
  Card,
  Loading,
  Modal,
  FormField,
  FormSection,
  Select,
  CheckboxGroup,
  TagInput,
  
  // Common Types
  type ButtonProps,
  type InputProps,
  type CardProps,
  type FormFieldProps,
  type SelectProps,
  type CheckboxOption,
  type SelectOption,
  type BaseComponentProps,
  type StandardComponentProps,
  type FormComponentProps,
  type InteractiveComponentProps
} from './ui';

