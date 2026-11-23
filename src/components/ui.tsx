import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type BadgeVariant = 'teal' | 'yellow' | 'blue' | 'purple' | 'neutral';

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  teal: {
    backgroundColor: 'var(--color-badge-teal-bg)',
    color: 'var(--color-badge-teal-fg)',
    borderColor: 'var(--color-badge-teal-border)',
  },
  yellow: {
    backgroundColor: 'var(--color-badge-yellow-bg)',
    color: 'var(--color-badge-yellow-fg)',
    borderColor: 'var(--color-badge-yellow-border)',
  },
  blue: {
    backgroundColor: 'var(--color-badge-blue-bg)',
    color: 'var(--color-badge-blue-fg)',
    borderColor: 'var(--color-badge-blue-border)',
  },
  purple: {
    backgroundColor: 'var(--color-badge-purple-bg)',
    color: 'var(--color-badge-purple-fg)',
    borderColor: 'var(--color-badge-purple-border)',
  },
  neutral: {
    backgroundColor: 'var(--color-badge-neutral-bg)',
    color: 'var(--color-badge-neutral-fg)',
    borderColor: 'var(--color-badge-neutral-border)',
  },
};

export function Badge({
  variant = 'neutral',
  label,
  className = '',
}: {
  variant?: BadgeVariant;
  label: string;
  className?: string;
}) {
  return (
    <span
      style={BADGE_STYLES[variant]}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

interface ButtonProps {
  id?: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  'aria-pressed'?: boolean;
  className?: string;
}

const BUTTON_SIZE: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[34px]',
  md: 'px-4 py-2 text-sm min-h-[40px]',
  lg: 'px-5 py-2.5 text-sm md:text-base min-h-[44px]',
};

const BUTTON_VARIANT: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'fr-btn-primary shadow-sm',
  secondary: 'fr-btn-secondary',
  ghost: 'fr-btn-ghost',
};

export function Button({
  id,
  label,
  variant = 'secondary',
  size = 'md',
  href,
  target,
  rel,
  icon,
  onClick,
  type = 'button',
  'aria-pressed': ariaPressed,
  className = '',
}: ButtonProps) {
  const classes = `fr-pressable inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-sandstone-50 dark:focus:ring-offset-ink-950 ${BUTTON_SIZE[size]} ${BUTTON_VARIANT[variant]} ${className}`;

  if (href) {
    return (
      <a id={id} href={href} target={target} rel={rel} className={classes}>
        {icon}
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={classes}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

interface TabContextValue {
  value: string;
  onChange: (val: string) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

export function TabList({
  id,
  'aria-label': ariaLabel,
  value,
  onChange,
  children,
  className = '',
}: {
  id?: string;
  role?: string;
  'aria-label'?: string;
  value: string;
  onChange: (val: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    if (!tabs.length) return;
    const currentIdx = tabs.findIndex((el) => el === document.activeElement);
    if (currentIdx === -1) return;

    let nextIdx = currentIdx;
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = tabs.length - 1;
    else return;

    e.preventDefault();
    const targetTab = tabs[nextIdx];
    targetTab.focus();
    const nextVal = targetTab.getAttribute('data-tab-value');
    if (nextVal) onChange(nextVal);
  }

  return (
    <TabContext.Provider value={{ value, onChange }}>
      <div
        ref={listRef}
        id={id}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={`flex flex-wrap gap-2 border-b border-sandstone-200 dark:border-skyline-800 pb-2 ${className}`}
      >
        {children}
      </div>
    </TabContext.Provider>
  );
}

export function Tab({
  id,
  value,
  panelId,
  label,
}: {
  id: string;
  value: string;
  panelId: string;
  label: string;
}) {
  const ctx = useContext(TabContext);
  const selected = ctx?.value === value;

  return (
    <button
      id={id}
      type="button"
      role="tab"
      data-tab-value={value}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={() => ctx?.onChange(value)}
      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 ${
        selected
          ? 'bg-skyline-700 text-white dark:bg-teal-300 dark:text-ink-950 border-b-2 border-gold-500 shadow-sm'
          : 'bg-white dark:bg-skyline-800/60 text-ink-700 dark:text-ink-300 border border-sandstone-200 dark:border-skyline-700 hover:border-gold-500 dark:hover:border-gold-300'
      }`}
    >
      {label}
    </button>
  );
}

export function ZoomDialog({
  id,
  isOpen,
  onClose,
  title,
  children,
}: {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="fr-dialog m-auto w-[min(64rem,calc(100vw-2rem))] max-h-[90dvh] rounded-2xl border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-900 text-ink-900 dark:text-sandstone-50 p-0 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-sandstone-200 dark:border-skyline-800 bg-sandstone-50 dark:bg-skyline-800/70">
        <h3
          id={id ? `${id}-title` : undefined}
          className="font-display text-lg font-bold tracking-wide text-ink-900 dark:text-sandstone-50 truncate"
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview modal"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-ink-950 text-ink-900 dark:text-sandstone-50 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
        >
          Close
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(90dvh-4rem)]">{children}</div>
    </dialog>
  );
}
