-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(255),
  interests TEXT[], -- Array of interest tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Table (videos, products, research papers)
CREATE TABLE content (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'video', 'product', 'paper'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(255),
  source_url VARCHAR(500) NOT NULL,
  source_platform VARCHAR(100), -- 'youtube', 'producthunt', 'arxiv', etc.
  source_id VARCHAR(255) UNIQUE NOT NULL, -- External ID
  category_id INTEGER REFERENCES categories(id),
  tags TEXT[],
  embeddings FLOAT8[], -- Vector embeddings for similarity search
  metadata JSONB, -- Flexible metadata
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  published_date TIMESTAMP,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Interactions Table
CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'save', 'share'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id, interaction_type)
);

-- Collections Table (user-created curated collections)
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  curator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(255),
  is_public BOOLEAN DEFAULT TRUE,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection Items Table
CREATE TABLE collection_items (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, content_id)
);

-- Collection Votes Table
CREATE TABLE collection_votes (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10), -- 'upvote', 'downvote'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, user_id)
);

-- User Follows Table (for curators)
CREATE TABLE user_follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

-- Saved Items Table
CREATE TABLE saved_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id)
);

-- User Preferences Table
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferred_categories TEXT[],
  notification_enabled BOOLEAN DEFAULT TRUE,
  email_digest BOOLEAN DEFAULT TRUE,
  theme VARCHAR(20) DEFAULT 'light',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync Logs Table (for tracking API syncs)
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  source_platform VARCHAR(100),
  items_synced INTEGER,
  items_added INTEGER,
  items_updated INTEGER,
  sync_duration_ms INTEGER,
  status VARCHAR(50), -- 'success', 'failed', 'partial'
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_category ON content(category_id);
CREATE INDEX idx_content_source_platform ON content(source_platform);
CREATE INDEX idx_content_published_date ON content(published_date DESC);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_content_id ON user_interactions(content_id);
CREATE INDEX idx_collections_curator_id ON collections(curator_id);
CREATE INDEX idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);

-- Create full-text search index
CREATE INDEX idx_content_search ON content USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
