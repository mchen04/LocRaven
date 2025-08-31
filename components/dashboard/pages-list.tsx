'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ExternalLink, 
  Search, 
  Calendar, 
  Trash2, 
  Edit,
  Eye,
  AlertCircle
} from 'lucide-react';

// Mock data - will be replaced with actual data fetching
const mockPages = [
  {
    id: 1,
    title: 'Fresh Fish Tacos Special',
    url: 'https://locraven.com/ca/riverside/riverside/mikes-tacos/fresh-fish-tacos',
    status: 'active',
    created: '2024-01-15',
    expires: '2024-02-15',
    views: 124,
    aiMentions: 8
  },
  {
    id: 2,
    title: 'Valentine\'s Day Dinner Menu',
    url: 'https://locraven.com/ca/riverside/riverside/mikes-tacos/valentines-menu',
    status: 'active',
    created: '2024-01-10',
    expires: '2024-02-14',
    views: 89,
    aiMentions: 12
  },
  {
    id: 3,
    title: 'Holiday Catering Services',
    url: 'https://locraven.com/ca/riverside/riverside/mikes-tacos/holiday-catering',
    status: 'expired',
    created: '2023-12-01',
    expires: '2024-01-02',
    views: 245,
    aiMentions: 15
  }
];

export function PagesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const activePages = mockPages.filter(page => page.status === 'active');
  const expiredPages = mockPages.filter(page => page.status === 'expired');

  const filteredPages = (pages: typeof mockPages) => 
    pages.filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your AI-Discoverable Pages</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Active ({activePages.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Expired ({expiredPages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <PagesTable pages={filteredPages(activePages)} showActions />
          </TabsContent>

          <TabsContent value="expired">
            <PagesTable pages={filteredPages(expiredPages)} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PagesTable({ pages, showActions = false }: { 
  pages: typeof mockPages; 
  showActions?: boolean; 
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>AI Mentions</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>
            <TableCell>
              <div>
                <p className="font-medium">{page.title}</p>
                <a 
                  href={page.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                >
                  View page <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={page.status === 'active' ? 'default' : 'secondary'}>
                {page.status}
              </Badge>
            </TableCell>
            <TableCell>{page.views}</TableCell>
            <TableCell>{page.aiMentions}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(page.expires).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {showActions && (
                  <>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}