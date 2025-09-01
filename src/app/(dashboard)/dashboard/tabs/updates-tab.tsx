'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UpdatesTabProps {}

export function UpdatesTab({}: UpdatesTabProps) {
  const [updateText, setUpdateText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [generatedPages, setGeneratedPages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePages = async () => {
    if (!updateText || !startDate || !expireDate) {
      return;
    }

    setIsGenerating(true);
    // TODO: Implement AI page generation API call
    setTimeout(() => {
      setGeneratedPages([
        'Business Update Landing Page',
        'Social Media Announcement',
        'Email Newsletter Content',
        'Website Banner',
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handlePublishPage = (page: string) => {
    // TODO: Implement publish functionality
    console.log('Publishing page:', page);
  };

  return (
    <div className='space-y-6'>
      <Card title='Create Business Update'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='update-text' className='mb-2 block text-sm font-medium text-white'>
              Update Content
            </label>
            <textarea
              id='update-text'
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              className='min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
              placeholder='Enter your business update or announcement...'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='start-date' className='mb-2 block text-sm font-medium text-white'>
                Start Date
              </label>
              <Input
                id='start-date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              />
            </div>
            <div>
              <label htmlFor='expire-date' className='mb-2 block text-sm font-medium text-white'>
                Expire Date
              </label>
              <Input
                id='expire-date'
                type='date'
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              />
            </div>
          </div>

          <Button
            onClick={handleGeneratePages}
            disabled={!updateText || !startDate || !expireDate || isGenerating}
            className='w-full'
          >
            {isGenerating ? 'Generating Pages...' : 'Generate AI Pages'}
          </Button>
        </div>
      </Card>

      {generatedPages.length > 0 && (
        <Card title='Generated Pages'>
          <div className='space-y-3'>
            {generatedPages.map((page, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-md bg-zinc-800 p-3'
              >
                <span className='text-white'>{page}</span>
                <div className='flex gap-2'>
                  <Button size='sm' variant='secondary'>
                    Preview
                  </Button>
                  <Button size='sm' onClick={() => handlePublishPage(page)}>
                    Publish
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Reuse the Card component from the original account page
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-semibold text-white'>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}