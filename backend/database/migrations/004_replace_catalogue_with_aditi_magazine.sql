ALTER TABLE magazines
    ADD COLUMN IF NOT EXISTS pdf_file LONGBLOB NULL,
    ADD COLUMN IF NOT EXISTS pdf_filename VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS pdf_mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf';

DELETE FROM user_cart_items;
DELETE FROM user_magazines;
DELETE FROM magazines;

INSERT INTO magazines (
    sku,
    slug,
    title,
    price_paise,
    currency,
    pdf_filename,
    pdf_mime_type,
    is_active
)
VALUES (
    'ADITI-MAG-V1-I1',
    'aditi-strategy-defence-volume-1-issue-1',
    'ADITI Strategy & Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy',
    35000,
    'INR',
    'ADITI-Strategy-Defence-Magazine-Volume-1-Issue-1.pdf',
    'application/pdf',
    1
);
