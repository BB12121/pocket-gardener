CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  register_time VARCHAR(32),
  city VARCHAR(100),
  reputation INT NOT NULL,
  avatar VARCHAR(32)
);

CREATE TABLE species (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  latin VARCHAR(200),
  category VARCHAR(100),
  water_cycle INT NOT NULL,
  fert_cycle INT NOT NULL,
  light VARCHAR(100)
);

CREATE TABLE plants (
  id VARCHAR(64) PRIMARY KEY,
  nickname VARCHAR(100) NOT NULL,
  species_id VARCHAR(64) NOT NULL,
  create_date VARCHAR(32),
  purchase_date VARCHAR(32),
  location VARCHAR(100),
  status VARCHAR(100),
  image VARCHAR(500)
);

CREATE TABLE plant_tags (
  plant_id VARCHAR(64) NOT NULL,
  tag VARCHAR(100) NOT NULL
);

CREATE TABLE care_logs (
  id VARCHAR(64) PRIMARY KEY,
  plant_id VARCHAR(64) NOT NULL,
  type VARCHAR(100) NOT NULL,
  time VARCHAR(32) NOT NULL,
  note VARCHAR(1000),
  status VARCHAR(100)
);

CREATE TABLE care_tasks (
  id VARCHAR(64) PRIMARY KEY,
  plant_id VARCHAR(64) NOT NULL,
  type VARCHAR(100) NOT NULL,
  plan_time VARCHAR(32) NOT NULL,
  priority VARCHAR(32),
  status VARCHAR(32),
  source VARCHAR(100)
);

CREATE TABLE ai_suggestions (
  id VARCHAR(64) PRIMARY KEY,
  plant_id VARCHAR(64) NOT NULL,
  time VARCHAR(32),
  risk VARCHAR(32),
  model VARCHAR(100),
  summary VARCHAR(500),
  detail VARCHAR(2000)
);

CREATE TABLE weather_alerts (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(100),
  level VARCHAR(32),
  time VARCHAR(32),
  suggestion VARCHAR(1000)
);

CREATE TABLE weather_alert_affected_plants (
  alert_id VARCHAR(64) NOT NULL,
  plant_id VARCHAR(64) NOT NULL
);

CREATE TABLE community_users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio VARCHAR(500),
  city VARCHAR(100),
  followers INT NOT NULL,
  following INT NOT NULL
);

CREATE TABLE followed_users (
  user_id VARCHAR(64) PRIMARY KEY
);

CREATE TABLE community_posts (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  author_id VARCHAR(64) NOT NULL,
  author VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content VARCHAR(2000),
  time VARCHAR(32),
  likes INT NOT NULL,
  comments INT NOT NULL,
  urgent VARCHAR(32)
);

CREATE TABLE community_post_tags (
  post_id VARCHAR(64) NOT NULL,
  tag VARCHAR(100) NOT NULL
);

CREATE TABLE community_post_images (
  post_id VARCHAR(64) NOT NULL,
  image VARCHAR(500) NOT NULL
);

CREATE TABLE achievements (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  achieved BOOLEAN NOT NULL,
  progress INT NOT NULL,
  target INT NOT NULL
);

CREATE TABLE checkin_days (
  checkin_date VARCHAR(32) PRIMARY KEY
);

CREATE TABLE plant_growth_points (
  id VARCHAR(100) PRIMARY KEY,
  plant_id VARCHAR(64) NOT NULL,
  metric VARCHAR(32) NOT NULL,
  date VARCHAR(32) NOT NULL,
  metric_value DOUBLE NOT NULL
);
