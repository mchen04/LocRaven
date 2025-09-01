export interface UserLink {
  id: string;
  title: string;
  slug: string | null;
  url: string;
  status: 'active' | 'expired';
  createdAt: string;
  expiresAt: string | null;
  expired: boolean | null;
  published: boolean | null;
  pageType: string | null;
  updateId: string;
}

export interface LinksTabProps {
  links?: UserLink[] | null;
}