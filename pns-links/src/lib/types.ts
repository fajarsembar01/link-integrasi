export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  category: string; // e.g. "Kepegawaian", "SPMB", "Latsar"
  agency?: string;  // e.g. "BKD DKI", "Kemendikbudristek"
  pinned?: boolean; // controlled via localStorage
};

export type LinksData = {
  categories: string[];
  items: LinkItem[];
};