import { NewsletterStaticDownloads } from "@/components/newsletter-static-downloads";

export const metadata = { title: "Newsletters | DefenseCodes" };

export default function NewslettersPage() {
  return (
    <div className="mx-auto max-w-4xl py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
      <NewsletterStaticDownloads />
    </div>
  );
}
