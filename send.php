<?php
/**
 * Booking form handler for Samsung Services Center.
 *
 * The form posts here. assets/js/main.js intercepts the submit and sends the
 * same data by fetch(), so the page does not reload — but the plain POST is the
 * fallback when JavaScript is off, which is why the form needs a real action.
 *
 * Bookings go to both inboxes. The client gave two addresses without saying
 * which owns the form, and a booking that lands in the wrong one is still a
 * booking; a booking that lands in neither is a lost customer. mail() accepts
 * a comma-separated list.
 *
 * FROM_EMAIL has to be a real mailbox on this domain or cPanel's mail server
 * rejects the message, which is why it is info@ rather than a no-reply@
 * address that may not exist. The customer's own address goes on Reply-To, so
 * hitting reply in the inbox still answers them.
 */

declare(strict_types=1);

// ── configure ───────────────────────────────────────────────────────────────
const TO_EMAIL   = 'support@samsungservices-center.com, info@samsungservices-center.com';
const FROM_EMAIL = 'info@samsungservices-center.com';   // must exist on this domain
const SITE_NAME  = 'Samsung Services Center';
const RATE_LIMIT_SECONDS = 30;                // one submission per visitor per 30s

// ── helpers ─────────────────────────────────────────────────────────────────
function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xhr    = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($accept, 'application/json') || $xhr === 'fetch';
}

function respond(int $status, string $message): never {
    http_response_code($status);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $status === 200, 'message' => $message]);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
           . "<title>" . ($status === 200 ? 'Request sent' : 'Could not send') . "</title>"
           . "<meta name=\"robots\" content=\"noindex\"></head><body>"
           . "<h1>" . ($status === 200 ? 'Thank you' : 'Sorry') . "</h1><p>{$safe}</p>"
           . "<p><a href=\"/\">Back to the site</a></p></body></html>";
    }
    exit;
}

function field(string $name, int $max = 500): string {
    $v = $_POST[$name] ?? '';
    if (!is_string($v)) return '';
    $v = trim($v);
    // strip anything that could be used for header injection
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr($v, 0, $max);
}

// ── method ──────────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'This endpoint only accepts form submissions.');
}

// ── spam controls ───────────────────────────────────────────────────────────
// Honeypot: a field hidden from people, so anything filling it is a bot.
if (field('company') !== '') {
    respond(200, 'Thank you, your request has been received.');   // fail silently
}

// Time trap: a genuine visitor takes more than three seconds to fill this in.
$started = (int) ($_POST['started'] ?? 0);
if ($started > 0 && (time() - intdiv($started, 1000)) < 3) {
    respond(200, 'Thank you, your request has been received.');
}

// Rate limit per IP, using the system temp directory.
$ip   = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$lock = sys_get_temp_dir() . '/ssc_' . sha1($ip) . '.lock';
if (is_file($lock) && (time() - filemtime($lock)) < RATE_LIMIT_SECONDS) {
    respond(429, 'You have just sent a request. Please wait a moment before sending another.');
}
@touch($lock);

// ── validate ────────────────────────────────────────────────────────────────
$name      = field('name', 120);
$phone     = field('phone', 40);
$email     = field('email', 160);
$appliance = field('appliance', 80);
$emirate   = field('emirate', 80);
$message   = field('message', 4000);

$errors = [];
if (mb_strlen($name) < 2) {
    $errors[] = 'a name';
}
if (!preg_match('/^[+()\d\s-]{7,20}$/', $phone)) {
    $errors[] = 'a phone number we can reach you on';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'a valid email address';
}
if (mb_strlen($message) < 10) {
    $errors[] = 'a short description of the fault';
}
if ($errors) {
    respond(422, 'Please provide ' . implode(', ', $errors) . '.');
}

// ── send ────────────────────────────────────────────────────────────────────
$subject = sprintf('[%s] %s — %s', SITE_NAME, $appliance !== '' ? $appliance : 'Repair request', $name);

$body = "New booking request\n"
      . str_repeat('-', 40) . "\n"
      . "Name:      {$name}\n"
      . "Phone:     {$phone}\n"
      . "Email:     " . ($email !== '' ? $email : '(not given)') . "\n"
      . "Appliance: {$appliance}\n"
      . "Emirate:   {$emirate}\n"
      . str_repeat('-', 40) . "\n"
      . "Fault:\n{$message}\n"
      . str_repeat('-', 40) . "\n"
      . 'Sent: ' . date('Y-m-d H:i:s') . "\n"
      . "IP:   {$ip}\n";

$headers = [
    'From: ' . SITE_NAME . ' <' . FROM_EMAIL . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = @mail(TO_EMAIL, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, 'The message could not be sent. Please call us instead.');
}
respond(200, 'Thank you, your request has been received. We will be in touch shortly.');
