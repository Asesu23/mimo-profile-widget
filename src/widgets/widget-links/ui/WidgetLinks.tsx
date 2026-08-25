'use client';

import { useCopyToClipboard } from '@features/copy-to-clipboard';
import { Field } from '@shared/ui/Field';

export function WidgetLinks({
  imageUrl,
  markdown,
  onDisconnect,
  t,
}: {
  imageUrl: string;
  markdown: string;
  onDisconnect: () => void;
  t: (key: string) => string;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
      <Field
        label={t('imageUrl')}
        value={imageUrl}
        onCopy={() => copy(imageUrl, 'image')}
        copied={copied === 'image'}
        copyLabel={t('copy')}
        copiedLabel={t('copied')}
      />
      <Field
        label={t('readmeMarkdown')}
        value={markdown}
        onCopy={() => copy(markdown, 'markdown')}
        copied={copied === 'markdown'}
        copyLabel={t('copy')}
        copiedLabel={t('copied')}
      />

      <button type="button" onClick={onDisconnect} className="self-start text-[11px] text-red-400/80 hover:text-red-400">
        {t('disconnect')}
      </button>
    </div>
  );
}
