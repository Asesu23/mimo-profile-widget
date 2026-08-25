'use client';

import { useState } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, kind: string) {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  }

  return { copied, copy };
}
