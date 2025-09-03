import { PropsWithChildren } from 'react';

interface MarketingLayoutProps extends PropsWithChildren {
  title: string;
  description?: string;
  lastUpdated?: string;
  showTableOfContents?: boolean;
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
}

export function MarketingLayout({
  children,
  title,
  description,
  lastUpdated,
  showTableOfContents = false,
  tableOfContents = [],
}: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-neutral-300">{description}</p>
          )}
          {lastUpdated && (
            <p className="mt-4 text-sm text-neutral-400">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {/* Table of Contents */}
        {showTableOfContents && tableOfContents.length > 0 && (
          <nav className="mb-12 rounded-lg bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {tableOfContents.map((item) => (
                <li key={item.id} className={`ml-${(item.level - 1) * 4}`}>
                  <a
                    href={`#${item.id}`}
                    className="text-neutral-300 hover:text-white"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-zinc-800 pt-8">
          <div className="rounded-lg bg-zinc-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Questions or Concerns?
            </h3>
            <p className="text-neutral-300">
              If you have any questions about this document or our practices, 
              please contact us at{' '}
              <a 
                href="mailto:legal@locraven.com" 
                className="text-blue-400 hover:text-blue-300"
              >
                legal@locraven.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSection({ 
  title, 
  id, 
  children 
}: { 
  title: string; 
  id: string; 
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        {title}
      </h2>
      <div className="space-y-4 text-neutral-200">
        {children}
      </div>
    </section>
  );
}

export function LastUpdated({ date }: { date: string }) {
  return (
    <div className="mb-8 rounded-lg bg-zinc-900 p-4">
      <p className="text-sm text-neutral-400">
        <strong>Last Updated:</strong> {date}
      </p>
    </div>
  );
}