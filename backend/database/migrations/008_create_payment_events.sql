CREATE TABLE payment_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    razorpay_order_id VARCHAR(191) NULL,
    razorpay_payment_id VARCHAR(191) NULL,
    source VARCHAR(40) NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    status VARCHAR(40) NOT NULL,
    message VARCHAR(255) NULL,
    payload_json LONGTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_events_user_id (user_id),
    INDEX idx_payment_events_razorpay_order_id (razorpay_order_id),
    INDEX idx_payment_events_status (status),
    CONSTRAINT fk_payment_events_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);
