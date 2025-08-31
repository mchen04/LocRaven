
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  X, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  Clock,
  Info,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Define available icon variants
export type IconName = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'close' 
  | 'refresh' 
  | 'trash' 
  | 'calendar' 
  | 'clock';

// Map icon names to lucide components
const iconMap: Record<IconName, LucideIcon> = {
  info: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  close: X,
  refresh: RefreshCw,
  trash: Trash2,
  calendar: Calendar,
  clock: Clock,
};

// Define custom SVG paths for icons not available in lucide-react
const customIconPaths: Record<string, string> = {
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  close: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
};

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  variant?: 'outline' | 'solid' | 'custom';
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className,
  variant = 'outline',
  ...props
}) => {
  // Use lucide-react icons for outline variant
  if (variant === 'outline') {
    const LucideIcon = iconMap[name];
    if (LucideIcon) {
      return (
        <LucideIcon
          size={size}
          className={className}
          {...props}
        />
      );
    }
  }

  // Use custom SVG for solid or custom variants
  const customPath = customIconPaths[name];
  const viewBox = name === 'close' ? '0 0 20 20' : '0 0 24 24';
  const strokeWidth = variant === 'solid' ? 0 : 2;
  const fill = variant === 'solid' ? 'currentColor' : 'none';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d={customPath}
        fillRule={variant === 'solid' ? 'evenodd' : undefined}
        clipRule={variant === 'solid' ? 'evenodd' : undefined}
      />
    </svg>
  );
};

// Convenience components for common icons with preset styling
export const InfoIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="info" {...props} />
);

export const SuccessIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="success" {...props} />
);

export const WarningIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="warning" {...props} />
);

export const ErrorIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="error" {...props} />
);

export const CloseIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="close" {...props} />
);

export default Icon;