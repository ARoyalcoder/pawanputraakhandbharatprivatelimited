import type { ReactNode } from 'react';

/** Inline **bold** only; everything else is rendered as text (never as HTML). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] };

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') });
    if (list) blocks.push(list);
    paragraph = [];
    list = null;
  };

  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith('### ')) {
      flush();
      blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (/^- /.test(line) || /^\d+\. /.test(line)) {
      const type = line.startsWith('- ') ? 'ul' : 'ol';
      if (paragraph.length) {
        blocks.push({ type: 'p', text: paragraph.join(' ') });
        paragraph = [];
      }
      if (!list || list.type !== type) {
        if (list) blocks.push(list);
        list = { type, items: [] };
      }
      list.items.push(line.replace(/^(- |\d+\. )/, ''));
    } else {
      if (list) {
        blocks.push(list);
        list = null;
      }
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

/** Headings in document order, for a table of contents. */
export function headingsOf(source: string) {
  return parseMarkdown(source)
    .filter((b): b is { type: 'h2'; text: string } => b.type === 'h2')
    .map((b) => ({ id: slugify(b.text), text: b.text }));
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseMarkdown(source).map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} id={slugify(block.text)} className="mt-14 scroll-mt-32 text-h3 text-navy-900 first:mt-0">
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="mt-9 text-h4 text-navy-900">
                {block.text}
              </h3>
            );
          case 'ul':
          case 'ol': {
            const List = block.type;
            return (
              <List key={i} className={`mt-5 space-y-2.5 pl-5 text-body-lg text-ink-soft ${block.type === 'ul' ? 'list-disc marker:text-gold-500' : 'list-decimal marker:font-semibold marker:text-gold-600'}`}>
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1.5">
                    {inline(item)}
                  </li>
                ))}
              </List>
            );
          }
          default:
            return (
              <p key={i} className="mt-5 text-body-lg text-ink-soft [&_strong]:font-semibold [&_strong]:text-navy-900">
                {inline(block.text)}
              </p>
            );
        }
      })}
    </>
  );
}
