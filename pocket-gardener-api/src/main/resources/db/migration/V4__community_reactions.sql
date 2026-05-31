CREATE TABLE post_likes (
  id VARCHAR(140) PRIMARY KEY,
  post_id VARCHAR(64) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  CONSTRAINT uk_post_like_user UNIQUE (post_id, user_id)
);

CREATE TABLE community_follows (
  id VARCHAR(140) PRIMARY KEY,
  follower_user_id VARCHAR(64) NOT NULL,
  target_user_id VARCHAR(64) NOT NULL,
  CONSTRAINT uk_community_follow_user UNIQUE (follower_user_id, target_user_id)
);

INSERT INTO community_follows (id, follower_user_id, target_user_id)
SELECT CONCAT('u1::', user_id), 'u1', user_id FROM followed_users;
