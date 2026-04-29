-- Create song_requests table for storing custom song orders
CREATE TABLE IF NOT EXISTS song_requests (
  id SERIAL PRIMARY KEY,
  recipient_name VARCHAR(255) NOT NULL,
  name_recording_url TEXT,
  relationship VARCHAR(255) NOT NULL,
  occasion VARCHAR(255) NOT NULL,
  story TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  addons TEXT[] DEFAULT '{}',
  total_price_cents INTEGER NOT NULL,
  product_id VARCHAR(100),
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_song_requests_email ON song_requests(email);
CREATE INDEX IF NOT EXISTS idx_song_requests_stripe_session ON song_requests(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_song_requests_payment_status ON song_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_song_requests_order_status ON song_requests(order_status);
