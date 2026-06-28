SET @schema_name := DATABASE();

SET @add_profile_completed_at := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN profile_completed_at DATETIME NULL AFTER profile_image_url',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'profile_completed_at'
);
PREPARE stmt FROM @add_profile_completed_at;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
