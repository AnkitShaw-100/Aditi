CREATE TABLE receipts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    razorpay_order_id VARCHAR(191) NOT NULL,
    razorpay_payment_id VARCHAR(191) NULL,
    receipt_number VARCHAR(80) NOT NULL,
    amount_paise INT UNSIGNED NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    purchase_date DATETIME NULL,
    email_to VARCHAR(255) NULL,
    email_sent_at DATETIME NULL,
    email_last_error TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipts_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE KEY uq_receipts_razorpay_order_id (razorpay_order_id),
    UNIQUE KEY uq_receipts_receipt_number (receipt_number),
    INDEX idx_receipts_user_id (user_id),
    INDEX idx_receipts_email_sent_at (email_sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
