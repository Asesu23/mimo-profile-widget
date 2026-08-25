export function Field({
  label,
  value,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-neutral-500">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-surface-border bg-surface px-3 py-2 text-[11px] text-neutral-400">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg border border-surface-border px-2.5 py-2 text-[11px] text-neutral-400 hover:border-accent hover:text-accent"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
