export interface Review {
  comment: string;
  star: number;
}

export type Bed = {
  count: number;
  size: 'queen' | 'king' | 'double' | 'single';
};
export type Bedroom = {
  type: string;
  beds: Bed[];
};

export interface Metadata {
  propertyType: string;
  bathroomNumber: string;
  bedrooms: Bedroom[];
  amenities: string[];
}
export interface Listing {
  error?: string;
  id: number;
  title: string;
  owner: string;
  address: string;
  thumbnail: string[];
  price: string;
  reviews: Review[];
  totalBeds?: number; // 新增字段，床位总数
  averageRating?: number; // 新增字段，平均评分
  metadata: Metadata;
  availability?: boolean; // 根据您的实际数据类型调整
  published: boolean;
  postedOn: string | null;
}
export interface ListingDetails {
  id: number;
  title: string;
  owner: string;
  address: string;
  price: string;
  thumbnail: string[];
  metadata: Metadata;
  reviews: Review[];
  availability?: boolean; // 根据您的实际数据类型调整
  published: boolean;
  postedOn: string | null;
}

export interface HostingListProps {
  refreshList: boolean;
  onHostCreated: () => void;
}
