import Stripe from "stripe";

export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  image_path: string;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  full_name?: string;
  billing_address?: string;
  payment_method?: string;
}

export interface Product {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface Price {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: string;
  currency?: string;
  type?: Stripe.Price.Type;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface Subscription {
  id: string;
  user_id: string;
  price_id: string;
  status?: string;
  metadata?: Stripe.Metadata;
  price?: Price;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
}
