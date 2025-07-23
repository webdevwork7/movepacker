
export interface Company {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  company_id: string;
  amount: number;
  position?: number;
  status: 'pending' | 'approved' | 'rejected';
  utr_number?: string;
  payment_verified: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  company_id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  from_location: string;
  to_location: string;
  moving_date?: string;
  message?: string;
  created_at: string;
}

export interface Banner {
  id: string;
  company_id: string;
  title: string;
  image_url?: string;
  priority: number;
  is_active: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
