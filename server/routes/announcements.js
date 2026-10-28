import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();
const validEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
router.post('/send', async (req, res) => {
  const { subject, body, recipients } = req.body || {};
  if (!subject?.trim() || !body?.trim()) return res.status(400).json({ message: 'Subject and message are required.' });
  if (!Array.isArray(recipients) || recipients.length === 0) return res.status(400).json({ message: 'Add at least one recipient email address.' });
  if (recipients.length > 300) return res.status(400).json({ message: 'Send to no more than 300 recipients at a time.' });
  const cleanRecipients = [...new Set(recipients.map(v => String(v).trim().toLowerCase()))];
  if (cleanRecipients.some(v => !validEmail(v))) return res.status(400).json({ message: 'One or more recipient email addresses are invalid.' });
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return res.status(503).json({ message: 'Email was not sent. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM in server/.env, then restart the server.' });
  }
  try {
    const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await transporter.sendMail({ from: MAIL_FROM, to: MAIL_FROM, bcc: cleanRecipients, subject: subject.trim(), text: body.trim(), html: `<div style="font-family:Arial,sans-serif;max-width:640px;line-height:1.6;color:#242522"><div style="background:#b82035;color:#fff;padding:18px 22px;font-weight:bold">COLLEGE SPORTS TOURNAMENTS</div><div style="padding:22px;border:1px solid #e5e0d7"><h2 style="margin-top:0">${escapeHtml(subject.trim())}</h2><p>${escapeHtml(body.trim()).replaceAll('\n','<br>')}</p><hr style="border:0;border-top:1px solid #e5e0d7"><small style="color:#77766f">Sent by your college sports tournament office.</small></div></div>` });
    res.json({ sent: true, recipients: cleanRecipients.length, message: `Email accepted by the configured mail server for ${cleanRecipients.length} recipient(s).` });
  } catch (error) {
    console.error('Email delivery failed:', error?.message || error);
    res.status(502).json({ message: 'The mail server could not send this email. Check SMTP credentials and provider settings.' });
  }
});
function escapeHtml(value) { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export default router;
