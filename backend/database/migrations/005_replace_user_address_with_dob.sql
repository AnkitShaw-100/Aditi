SET @schema_name := DATABASE();

SET @add_email := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL AFTER clerk_user_id',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'email'
);
PREPARE stmt FROM @add_email;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @copy_email := (
    SELECT IF(
        COUNT(*) = 1,
        'UPDATE users SET email = COALESCE(email, gmail)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'gmail'
);
PREPARE stmt FROM @copy_email;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_dob := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN dob DATE NULL AFTER phone_number',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'dob'
);
PREPARE stmt FROM @add_dob;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_username := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN username VARCHAR(255) NULL AFTER dob',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'username'
);
PREPARE stmt FROM @add_username;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @copy_username := (
    SELECT IF(
        COUNT(*) = 1,
        'UPDATE users SET username = COALESCE(username, user_name)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'user_name'
);
PREPARE stmt FROM @copy_username;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_address := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE users DROP COLUMN address',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'address'
);
PREPARE stmt FROM @drop_address;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_gmail_index := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE users DROP INDEX idx_users_gmail',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND INDEX_NAME = 'idx_users_gmail'
);
PREPARE stmt FROM @drop_gmail_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_gmail := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE users DROP COLUMN gmail',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'gmail'
);
PREPARE stmt FROM @drop_gmail;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_user_name := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE users DROP COLUMN user_name',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'user_name'
);
PREPARE stmt FROM @drop_user_name;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_email_index := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD INDEX idx_users_email (email)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'users'
      AND INDEX_NAME = 'idx_users_email'
);
PREPARE stmt FROM @add_email_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

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
