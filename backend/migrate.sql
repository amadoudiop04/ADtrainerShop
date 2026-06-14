-- Migration: tailles de vêtements + Stripe + order_items
-- À exécuter une fois sur la DB existante

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS available_sizes JSONB NOT NULL DEFAULT '["XS","S","M","L","XL","XXL"]';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(product_id),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  size          TEXT,
  unit_price    NUMERIC(10,2) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS size TEXT;
