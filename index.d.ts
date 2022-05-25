export function generateEmail(
  templateName: string,
  vars: Record<string, any>,
  language: string,
  fallbackLanguage?: string,
): { html: string; text: string; subject: string }
