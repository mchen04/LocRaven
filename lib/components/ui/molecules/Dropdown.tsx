'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, LucideIcon } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

export interface DropdownSection {
  title?: string;
  items: DropdownItem[];
}

export interface DropdownProps {
  items?: DropdownItem[];
  sections?: DropdownSection[];
  trigger?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  sections,
  trigger,
  disabled = false,
  className = '',
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Element)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  // Use sections if provided, otherwise create a single section from items
  const dropdownSections = sections || (items ? [{ items }] : []);

  const renderDropdownItem = (item: DropdownItem) => (
    <button
      key={item.id}
      className={`dropdown-item ${item.variant === 'danger' ? 'danger' : ''} ${item.disabled ? 'disabled' : ''}`}
      onClick={() => handleItemClick(item)}
      disabled={item.disabled}
      type="button"
    >
      {item.icon && <item.icon size={14} />}
      <span>{item.label}</span>
    </button>
  );

  const renderSection = (section: DropdownSection, sectionIndex: number) => (
    <div key={sectionIndex}>
      {section.title && (
        <div className="dropdown-section-title">{section.title}</div>
      )}
      {section.items.map(renderDropdownItem)}
    </div>
  );

  return (
    <div 
      ref={dropdownRef}
      className={`dropdown-container ${className}`}
    >
      <button
        className={`dropdown-trigger ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger || <MoreHorizontal size={16} />}
      </button>

      {isOpen && (
        <div className={`dropdown-menu ${align === 'left' ? 'left' : 'right'}`}>
          {dropdownSections.map((section, index) => (
            <React.Fragment key={index}>
              {renderSection(section, index)}
              {index < dropdownSections.length - 1 && (
                <div className="dropdown-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;