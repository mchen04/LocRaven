'use client';

import React, { useState } from 'react';
import { Button, Input, Card, Spinner } from '../atoms';
import { SearchInput, AlertCard, LoadingCard } from '../molecules';
import { ErrorBoundary } from '../organisms';

const ComponentShowcase: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          LocRaven Design System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A showcase of our atomic design components
        </p>
      </div>

      {/* Atoms Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Atoms
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Basic building blocks that cannot be broken down further.
        </p>

        {/* Buttons */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input 
                label="Text Input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="Email Input"
                type="email"
                placeholder="Enter email..."
              />
              <Input 
                label="Password Input"
                type="password"
                placeholder="Enter password..."
              />
              <Input 
                label="Error State"
                placeholder="This field has an error"
                error="This field is required"
              />
              <Input 
                label="Success State"
                placeholder="This field is valid"
                success
                defaultValue="Valid input"
              />
              <Input 
                label="Disabled Input"
                placeholder="Disabled field"
                disabled
              />
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default" padding="md">
                <h4 className="font-medium mb-2">Default Card</h4>
                <p className="text-sm text-gray-600">Basic card with shadow</p>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 className="font-medium mb-2">Outlined Card</h4>
                <p className="text-sm text-gray-600">Card with border</p>
              </Card>
              <Card variant="elevated" padding="md">
                <h4 className="font-medium mb-2">Elevated Card</h4>
                <p className="text-sm text-gray-600">Card with more shadow</p>
              </Card>
              <Card variant="ghost" padding="md">
                <h4 className="font-medium mb-2">Ghost Card</h4>
                <p className="text-sm text-gray-600">Transparent card</p>
              </Card>
            </div>
          </div>

          {/* Spinners */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Spinners
            </h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-sm text-gray-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className="text-sm text-gray-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-sm text-gray-600 mt-2">Large</p>
              </div>
              <div className="text-center">
                <Spinner size="md" color="secondary" />
                <p className="text-sm text-gray-600 mt-2">Secondary</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Molecules Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Molecules
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Combinations of atoms that work together as a unit.
        </p>

        <div className="space-y-6">
          {/* Search Input */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Search Input
            </h3>
            <div className="max-w-md">
              <SearchInput
                placeholder="Search components..."
                onSearch={(query) => console.log('Search:', query)}
                onClear={() => console.log('Clear')}
              />
            </div>
          </div>

          {/* Alert Cards */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Alert Cards
            </h3>
            <div className="space-y-4 max-w-2xl">
              {showAlert && (
                <AlertCard
                  variant="info"
                  title="Information"
                  message="This is an informational message with dismissible functionality."
                  dismissible
                  onDismiss={() => setShowAlert(false)}
                />
              )}
              <AlertCard
                variant="success"
                title="Success!"
                message="Your operation was completed successfully."
                action={{
                  label: 'View Details',
                  onClick: () => console.log('View details clicked')
                }}
              />
              <AlertCard
                variant="warning"
                title="Warning"
                message="Please review your settings before proceeding."
              />
              <AlertCard
                variant="error"
                title="Error"
                message="An error occurred while processing your request."
              />
            </div>
          </div>

          {/* Loading Card */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Loading Card
            </h3>
            <div className="max-w-sm">
              <LoadingCard
                message="Loading your data..."
                spinnerSize="lg"
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Organisms Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Organisms
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Complex components that combine molecules and atoms.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Error Boundary
            </h3>
            <Card padding="md" className="max-w-md">
              <p className="text-sm text-gray-600 mb-4">
                Error boundaries catch JavaScript errors anywhere in their child component tree.
              </p>
              <ErrorBoundary>
                <Button 
                  onClick={() => {
                    throw new Error('Demo error');
                  }}
                  variant="danger"
                  size="sm"
                >
                  Trigger Error
                </Button>
              </ErrorBoundary>
            </Card>
          </div>
        </div>
      </section>

      {/* Design Tokens Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Design Tokens
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Our design system foundation - colors, typography, and spacing.
        </p>

        <div className="space-y-6">
          {/* Colors */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mb-2 mx-auto"></div>
                <p className="text-sm font-medium">Primary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-lg mb-2 mx-auto"></div>
                <p className="text-sm font-medium">Secondary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg mb-2 mx-auto"></div>
                <p className="text-sm font-medium">Success</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-lg mb-2 mx-auto"></div>
                <p className="text-sm font-medium">Warning</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-lg mb-2 mx-auto"></div>
                <p className="text-sm font-medium">Danger</p>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Typography
            </h3>
            <div className="space-y-2">
              <p className="text-5xl font-bold">Heading 1</p>
              <p className="text-4xl font-bold">Heading 2</p>
              <p className="text-3xl font-bold">Heading 3</p>
              <p className="text-2xl font-semibold">Heading 4</p>
              <p className="text-xl font-semibold">Heading 5</p>
              <p className="text-base">Body text - Lorem ipsum dolor sit amet</p>
              <p className="text-sm text-gray-600">Small text - Additional information</p>
              <p className="text-xs text-gray-500">Caption text - Fine print</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentShowcase;