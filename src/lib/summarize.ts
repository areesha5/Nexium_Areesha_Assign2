export function generateSummary(content: string): string {
  return content.split('.').slice(0, 2).join('.') + '.'; // fake summary
}
