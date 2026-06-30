<?php

declare(strict_types=1);

namespace App\Mail;

final class Mailer
{
    public function __construct(private readonly array $config)
    {
    }

    public function sendHtml(string $to, string $subject, string $html): void
    {
        if (($this->config['enabled'] ?? false) !== true) {
            throw new \RuntimeException('Mail is not enabled.');
        }

        $fromAddress = (string) ($this->config['from_address'] ?? '');
        $fromName = (string) ($this->config['from_name'] ?? 'ADITI');

        if ($fromAddress === '') {
            throw new \RuntimeException('MAIL_FROM_ADDRESS is not configured.');
        }

        if (($this->config['mailer'] ?? 'mail') === 'smtp') {
            $this->sendViaSmtp($to, $subject, $html, $fromAddress, $fromName);
            return;
        }

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $this->formatAddress($fromAddress, $fromName),
            'Reply-To: ' . $this->formatAddress($fromAddress, $fromName),
        ];

        if (!mail($to, $encodedSubject, $html, implode("\r\n", $headers))) {
            throw new \RuntimeException('PHP mail() failed to send the receipt.');
        }
    }

    private function sendViaSmtp(
        string $to,
        string $subject,
        string $html,
        string $fromAddress,
        string $fromName
    ): void {
        $host = (string) ($this->config['host'] ?? '');
        $port = (int) ($this->config['port'] ?? 587);
        $username = (string) ($this->config['username'] ?? '');
        $password = (string) ($this->config['password'] ?? '');
        $encryption = strtolower((string) ($this->config['encryption'] ?? 'tls'));

        if ($host === '') {
            throw new \RuntimeException('MAIL_HOST is not configured.');
        }

        $remote = $encryption === 'ssl' ? 'ssl://' . $host : $host;
        $socket = @stream_socket_client($remote . ':' . $port, $errno, $errstr, 20);

        if (!is_resource($socket)) {
            throw new \RuntimeException('Unable to connect to SMTP server: ' . $errstr);
        }

        stream_set_timeout($socket, 20);
        $this->expectSmtp($socket, [220]);
        $this->smtpCommand($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);

        if ($encryption === 'tls') {
            $this->smtpCommand($socket, 'STARTTLS', [220]);

            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new \RuntimeException('Unable to start SMTP TLS encryption.');
            }

            $this->smtpCommand($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);
        }

        if ($username !== '') {
            $this->smtpCommand($socket, 'AUTH LOGIN', [334]);
            $this->smtpCommand($socket, base64_encode($username), [334]);
            $this->smtpCommand($socket, base64_encode($password), [235]);
        }

        $messageId = bin2hex(random_bytes(12)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
        $headers = [
            'From: ' . $this->formatAddress($fromAddress, $fromName),
            'To: ' . $to,
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Message-ID: <' . $messageId . '>',
        ];
        $message = implode("\r\n", $headers) . "\r\n\r\n" . $html;

        $this->smtpCommand($socket, 'MAIL FROM:<' . $fromAddress . '>', [250]);
        $this->smtpCommand($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        $this->smtpCommand($socket, 'DATA', [354]);
        fwrite($socket, str_replace("\n.", "\n..", $message) . "\r\n.\r\n");
        $this->expectSmtp($socket, [250]);
        $this->smtpCommand($socket, 'QUIT', [221]);
        fclose($socket);
    }

    private function smtpCommand(mixed $socket, string $command, array $expectedCodes): string
    {
        fwrite($socket, $command . "\r\n");

        return $this->expectSmtp($socket, $expectedCodes);
    }

    private function expectSmtp(mixed $socket, array $expectedCodes): string
    {
        $response = '';

        do {
            $line = fgets($socket);

            if ($line === false) {
                throw new \RuntimeException('SMTP server did not respond.');
            }

            $response .= $line;
        } while (isset($line[3]) && $line[3] === '-');

        $code = (int) substr($response, 0, 3);

        if (!in_array($code, $expectedCodes, true)) {
            throw new \RuntimeException('SMTP error: ' . trim($response));
        }

        return $response;
    }

    private function formatAddress(string $email, string $name): string
    {
        return sprintf(
            '"%s" <%s>',
            addcslashes($name, '\\"'),
            $email
        );
    }
}
