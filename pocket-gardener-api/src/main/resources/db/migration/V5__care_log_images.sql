CREATE TABLE care_log_images (
  log_id VARCHAR(64) NOT NULL,
  image CLOB NOT NULL
);

ALTER TABLE community_post_images ALTER COLUMN image CLOB;
