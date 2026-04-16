/** Small chain marks for payment buttons (no external assets). */

export function IconEthereum({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 33 53"
      fill="none"
      className={className}
      aria-hidden
    >
      <path d="M0 17.93V20.8L16.5 1.6V0L0 17.93Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M16.5 0V1.6L33 20.8V17.93L16.5 0Z" fill="currentColor" />
      <path d="M0 35.87L16.5 53V28.1L0 20.73V35.87Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M33 35.87V20.73L16.5 28.1V53L33 35.87Z" fill="currentColor" />
      <path d="M16.5 58L33 41.07V38.2L16.5 57.2V58Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M16.5 58V57.2L0 38.2V41.07L16.5 58Z" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/** BNB Smart Chain mark (gold + dark mark). */
export function IconBnbChain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="#F0B90B" />
      <path
        fill="#1E2329"
        fillRule="evenodd"
        d="M12 5.5 6.5 9v6L12 18.5l5.5-3.5V9L12 5.5Zm0 1.8 3.7 2.4-3.7 2.4-3.7-2.4 3.7-2.4Zm-3.9 3.6L12 13l3.9-2.1v4.2L12 17.2l-3.9-2.1v-4.2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
