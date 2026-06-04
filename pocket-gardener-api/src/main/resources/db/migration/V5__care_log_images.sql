CREATE TABLE care_log_images (
  log_id VARCHAR(64) NOT NULL,
  image LONGTEXT NOT NULL
);

ALTER TABLE community_post_images MODIFY COLUMN image LONGTEXT NOT NULL;
