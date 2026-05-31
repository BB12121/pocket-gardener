CREATE TABLE community_comments (
  id VARCHAR(64) PRIMARY KEY,
  post_id VARCHAR(64) NOT NULL,
  author_id VARCHAR(64) NOT NULL,
  author VARCHAR(100) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  time VARCHAR(32) NOT NULL
);
