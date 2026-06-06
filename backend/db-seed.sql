-- Seed data for ADtrainerShop PostgreSQL database
-- Utiliser après la création du schéma : psql -f db-schema.sql -f db-seed.sql

INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone, role, is_active)
VALUES
  (uuid_generate_v4(), 'admin@adtrainershop.local', 'admin-password-placeholder', 'Admin', 'User', '+33123456789', 'admin', TRUE),
  (uuid_generate_v4(), 'client1@example.com', 'customer-password-placeholder', 'Alex', 'Dupont', '+33611223344', 'customer', TRUE),
  (uuid_generate_v4(), 'client2@example.com', 'customer-password-placeholder', 'Marion', 'Ndiaye', '+33655667788', 'customer', TRUE);

INSERT INTO collections (collection_id, name, slug, description, is_active)
VALUES
  (uuid_generate_v4(), 'Collection Été', 'collection-ete', 'Maillots et accessoires pour l''été.', TRUE),
  (uuid_generate_v4(), 'Collection Capsule', 'collection-capsule', 'Pieces exclusives en édition limitée.', TRUE);

INSERT INTO products (product_id, collection_id, name, slug, description, price, stock, sku, image_url, status)
SELECT
  uuid_generate_v4(), c.collection_id, 'Maillot de sport', 'maillot-sport', 'Maillot respirant pour entrainement intensif.', 39.90, 120, 'ADTSHIRT001', 'https://example.com/images/maillot-sport.jpg', 'available'
FROM collections c WHERE c.slug = 'collection-ete'
UNION ALL
SELECT
  uuid_generate_v4(), c.collection_id, 'Casquette AD', 'casquette-ad', 'Casquette de sport au look moderne.', 24.50, 80, 'ADCAP001', 'https://example.com/images/casquette-ad.jpg', 'available'
FROM collections c WHERE c.slug = 'collection-ete'
UNION ALL
SELECT
  uuid_generate_v4(), c.collection_id, 'Short training', 'short-training', 'Short confortable pour le training.', 29.90, 60, 'ADSHORT001', 'https://example.com/images/short-training.jpg', 'available'
FROM collections c WHERE c.slug = 'collection-capsule';

INSERT INTO product_images (image_id, product_id, url, alt_text, display_order)
SELECT uuid_generate_v4(), product_id, 'https://example.com/images/maillot-sport-1.jpg', 'Maillot sport face', 0
FROM products WHERE slug = 'maillot-sport';

INSERT INTO product_images (image_id, product_id, url, alt_text, display_order)
SELECT uuid_generate_v4(), product_id, 'https://example.com/images/casquette-ad-1.jpg', 'Casquette AD', 0
FROM products WHERE slug = 'casquette-ad';

INSERT INTO product_images (image_id, product_id, url, alt_text, display_order)
SELECT uuid_generate_v4(), product_id, 'https://example.com/images/short-training-1.jpg', 'Short de training', 0
FROM products WHERE slug = 'short-training';

INSERT INTO carts (cart_id, user_id)
SELECT uuid_generate_v4(), user_id FROM users WHERE email = 'client1@example.com';

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
SELECT uuid_generate_v4(), c.cart_id, p.product_id, 2
FROM carts c
JOIN users u ON u.user_id = c.user_id
JOIN products p ON p.slug = 'maillot-sport'
WHERE u.email = 'client1@example.com';

INSERT INTO orders (order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status)
SELECT uuid_generate_v4(), u.user_id, 'ADTSHP-0001', 69.80, '12 rue du Sport, 75001 Paris', '12 rue du Sport, 75001 Paris', 'paid', 'card', 'paid'
FROM users u WHERE u.email = 'client1@example.com';

INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price)
SELECT uuid_generate_v4(), o.order_id, p.product_id, 2, p.price
FROM orders o
JOIN users u ON u.user_id = o.user_id
JOIN products p ON p.slug = 'maillot-sport'
WHERE u.email = 'client1@example.com' AND o.order_number = 'ADTSHP-0001';

INSERT INTO coaching_requests (request_id, user_id, full_name, email, phone, coaching_type, availability, message, status)
SELECT uuid_generate_v4(), u.user_id, 'Alex Dupont', u.email, u.phone, 'one_to_one', 'Lundi et Mercredi matin', 'Je souhaite un suivi personnalisé pour la préparation d''une compétition.', 'new'
FROM users u WHERE u.email = 'client1@example.com';

INSERT INTO newsletter_subscriptions (subscription_id, email, first_name, last_name, is_confirmed, subscribed_at)
VALUES
  (uuid_generate_v4(), 'newsletter1@example.com', 'Eva', 'Leroy', TRUE, NOW()),
  (uuid_generate_v4(), 'newsletter2@example.com', 'Kylian', 'Moussa', FALSE, NOW());

INSERT INTO admin_actions (admin_action_id, admin_user_id, action, metadata)
SELECT uuid_generate_v4(), user_id, 'seed_data_inserted', '{"source":"db-seed.sql"}'::jsonb
FROM users WHERE email = 'admin@adtrainershop.local';
