ALTER TABLE receipts
    ADD COLUMN payment_method VARCHAR(80) NULL AFTER currency,
    ADD COLUMN payment_status VARCHAR(40) NULL AFTER payment_method,
    ADD COLUMN order_status VARCHAR(40) NULL AFTER payment_status,
    ADD COLUMN receipt_html MEDIUMTEXT NULL AFTER email_last_error;
