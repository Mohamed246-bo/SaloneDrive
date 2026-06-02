-- ==========================
-- SALONEDRIVE DATABASE SCHEMA
-- ==========================
-- This schema is for PostgreSQL/MySQL alternative to Firebase

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 5.00,
  user_type ENUM('passenger', 'driver') DEFAULT 'passenger',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_color VARCHAR(50),
  total_rides INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  rating DECIMAL(3,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rides Table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  driver_id UUID,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  fare DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  estimated_time INT,
  actual_time INT,
  distance DECIMAL(10,2),
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Safety Reports Table
CREATE TABLE safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ride_id UUID,
  incident_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('open', 'under_review', 'resolved') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
);

-- Routes Table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  distance DECIMAL(10,2),
  estimated_time INT,
  vehicle_type VARCHAR(50) NOT NULL,
  standard_fare DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL,
  user_id UUID NOT NULL,
  driver_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  reviewed_user_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Locations Table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- INDEXES FOR PERFORMANCE
-- ==========================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_is_active ON drivers(is_active);
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_safety_reports_user_id ON safety_reports(user_id);
CREATE INDEX idx_safety_reports_status ON safety_reports(status);
CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reviews_ride_id ON reviews(ride_id);
CREATE INDEX idx_locations_name ON locations(name);

-- ==========================
-- VIEWS FOR ANALYTICS
-- ==========================

CREATE VIEW active_drivers AS
SELECT 
  d.id,
  u.name,
  u.phone,
  d.vehicle_type,
  d.vehicle_number,
  d.rating,
  d.total_rides,
  d.total_earnings
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE d.is_active = true AND u.is_active = true;

CREATE VIEW ride_statistics AS
SELECT 
  DATE(created_at) as ride_date,
  vehicle_type,
  COUNT(*) as total_rides,
  AVG(fare) as avg_fare,
  SUM(fare) as total_earnings,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_rides
FROM rides
GROUP BY DATE(created_at), vehicle_type;

CREATE VIEW user_statistics AS
SELECT 
  u.id,
  u.name,
  COUNT(r.id) as total_rides,
  AVG(r.rating) as avg_rating,
  SUM(r.fare) as total_spent,
  MAX(r.created_at) as last_ride_date
FROM users u
LEFT JOIN rides r ON u.id = r.user_id
GROUP BY u.id, u.name;