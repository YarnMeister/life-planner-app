import { Resend } from 'resend';

// Initialize Resend - will be undefined if API key not set (for development)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface SendAuthCodeParams {
  email: string;
  code: string;
}

export async function sendAuthCode({ email, code }: SendAuthCodeParams): Promise<void> {
  // Mock mode for development without Resend API key
  if (!resend) {
    console.log('='.repeat(60));
    console.log('📧 MOCK EMAIL MODE - No RESEND_API_KEY configured');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log(`Expires: 10 minutes`);
    console.log('='.repeat(60));
    console.log('💡 To enable real emails, add RESEND_API_KEY to your .env');
    console.log('='.repeat(60));
    return;
  }

  try {
    await resend.emails.send({
      from: 'App Template <auth@updates.micromanage.ai>',
      to: [email],
      subject: 'Your App Template login code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #1f2937; margin: 0;">App Template</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Modern React Application</p>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Your login code</h2>
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">
              ${code}
            </div>
            <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
              This code will expire in 10 minutes
            </p>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <p>This email was sent by App Template authentication system.</p>
          </div>
        </div>
      `,
      text: `Your App Template login code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`
    });

    console.log(`Auth code sent to ${email}`);
  } catch (error) {
    console.error('Failed to send auth code:', error);
    throw new Error('Failed to send authentication code');
  }
}

