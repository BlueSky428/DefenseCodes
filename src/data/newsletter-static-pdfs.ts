/** PDFs shipped under `public/newsletters/` — free download, no auth. */
export type NewsletterStaticPdf = {
  href: string;
  title: string;
  downloadFilename: string;
};

export const NEWSLETTER_STATIC_PDFS: readonly NewsletterStaticPdf[] = [] as const;
