CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(191) NOT NULL UNIQUE,
    gmail VARCHAR(255) NULL,
    phone_number VARCHAR(40) NULL,
    address TEXT NULL,
    user_name VARCHAR(255) NULL,
    profile_image_url VARCHAR(2048) NULL,
    last_sign_in_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_gmail (gmail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sign_in_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    clerk_session_id VARCHAR(191) NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(512) NULL,
    signed_in_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sign_in_events_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_sign_in_events_user_id (user_id),
    INDEX idx_sign_in_events_signed_in_at (signed_in_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE magazines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(191) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    price_paise INT UNSIGNED NOT NULL DEFAULT 35000,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    pdf_path VARCHAR(2048) NULL,
    pdf_file LONGBLOB NULL,
    pdf_filename VARCHAR(255) NULL,
    pdf_mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_magazines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    magazine_id BIGINT UNSIGNED NOT NULL,
    razorpay_order_id VARCHAR(191) NULL,
    razorpay_payment_id VARCHAR(191) NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    purchased_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_magazines_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_magazines_magazine_id
        FOREIGN KEY (magazine_id) REFERENCES magazines(id)
        ON DELETE RESTRICT,
    UNIQUE KEY uq_user_magazine_order (user_id, magazine_id, razorpay_order_id),
    INDEX idx_user_magazines_user_id (user_id),
    INDEX idx_user_magazines_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO magazines (sku, slug, title, price_paise, currency, pdf_filename, pdf_mime_type)
VALUES
    (
        'ADITI-MAG-V1-I1',
        'aditi-strategy-defence-volume-1-issue-1',
        'ADITI Strategy & Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy',
        35000,
        'INR',
        'ADITI-Strategy-Defence-Magazine-Volume-1-Issue-1.pdf',
        'application/pdf'
    );
