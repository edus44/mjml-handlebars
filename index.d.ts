export function generateEmail(
  templateName: string,
  vars: Record<string, any>,
  language: string,
): { html: string; text: string }
