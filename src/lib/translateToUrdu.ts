const dictionary: Record<string, string> = {
  "life": "زندگی",
  "is": "ہے",
  "beautiful": "خوبصورت"
};

export function translateToUrdu(text: string): string {
  return text
    .split(' ')
    .map(word => dictionary[word.toLowerCase()] || word)
    .join(' ');
}
