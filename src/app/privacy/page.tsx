import { GlassPanel } from "@/components/glass-panel";

export const metadata = { title: "Privacy Policy | DefenseCodes" };

const sectionTitle =
  "mt-8 font-[family-name:var(--font-space)] text-lg font-semibold text-white first:mt-0";
const body = "mt-3 text-sm leading-relaxed text-slate-400";
const list = "mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
      <GlassPanel className="p-6 min-[400px]:p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
          Privacy Policy
        </h1>
        <p className={body}>
          Welcome to Defense.Codes, a strategic supply chain risk intelligence
          platform. Defense.Codes is a DBA of CAPACLOUD CORP (&ldquo;we&rdquo; or
          &ldquo;us&rdquo; or &ldquo;our&rdquo;), located at 1309 Coffeen Avenue
          STE 1200, Sheridan, Wyoming 82801. We provide risk analysis reports for
          the Defense, Space, and Aerospace sectors, and we are committed to
          protecting the data of our professional and institutional users in
          accordance with the following &ldquo;Privacy Policy&rdquo;.
        </p>

        <h2 className={sectionTitle}>Information We Collect</h2>
        <p className={body}>
          We collect information necessary to provide supply chain intelligence
          and facilitate secure digital transactions:
        </p>
        <ul className={list}>
          <li>
            <strong className="text-slate-300">Wallet Information:</strong> To use
            our services, including the &ldquo;Connect wallet&rdquo; feature, we
            interact with your blockchain wallet address.
          </li>
        </ul>

        <h2 className={sectionTitle}>How We Use Your Information</h2>
        <p className={body}>Your information is used to:</p>
        <ul className={list}>
          <li>
            <strong className="text-slate-300">Report Delivery:</strong> To unlock
            and provide full report PDFs after a successful payment.
          </li>
        </ul>

        <h2 className={sectionTitle}>Disclosure of Information</h2>
        <p className={body}>We share information as follows:</p>
        <ul className={list}>
          <li>
            <strong className="text-slate-300">Legal Compliance:</strong> We may
            disclose information if required by law to protect our rights or
            comply with a judicial proceeding.
          </li>
        </ul>

        <h2 className={sectionTitle}>Data Security</h2>

        <h2 className={sectionTitle}>Your Rights</h2>
        <p className={body}>
          You have the following rights regarding your personal information:
        </p>
        <ul className={list}>
          <li>
            <strong className="text-slate-300">Access and Correction:</strong> You
            can request access to your personal information and ask us to correct
            or update it.
          </li>
          <li>
            <strong className="text-slate-300">Opt-Out:</strong> You can opt out
            of receiving marketing communications from us by following the
            unsubscribe instructions provided in those communications.
          </li>
          <li>
            <strong className="text-slate-300">Children&rsquo;s Privacy:</strong>{" "}
            We do not knowingly collect personal information from children under
            the age of 13.
          </li>
          <li>
            <strong className="text-slate-300">
              Right to Suspend Cryptocurrency Wallet Accounts:
            </strong>{" "}
            The Company reserves the unconditional and absolute right, exercisable
            at its sole and unfettered discretion and without prior notice, to
            suspend, restrict, freeze, or permanently terminate any user&rsquo;s
            wallet account, access to services, or pending transactions based on
            any information received, obtained, discovered, or inferred from any
            source whatsoever.
          </li>
        </ul>

        <h2 className={sectionTitle}>Changes to this Privacy Policy</h2>
        <p className={body}>
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page. We encourage you to review this Privacy Policy
          periodically to stay informed about how we collect, use, and protect
          your information.
        </p>

        <h2 className={sectionTitle}>Governing law and dispute resolution</h2>
        <p className={body}>
          Any disputes or claims arising out of or in connection with this Privacy
          Policy, its subject matter, or its formation (including non-contractual
          disputes or claims) shall be governed by and construed in accordance
          with the laws of the State of Wyoming, United States of America, without
          regard to its conflict of law principles. Any dispute, controversy, or
          claim arising out of or relating to this Privacy Policy, including its
          interpretation, validity, performance, breach, or termination, shall be
          subject to the exclusive jurisdiction of the state and federal courts
          located in the State of Wyoming. By accessing or using our website or
          services, you irrevocably consent and submit to the personal jurisdiction
          and venue of such courts and waive any objection based on inconvenient
          forum or lack of jurisdiction.
        </p>

        <h2 className={sectionTitle}>Contact Us</h2>
        <p className={body}>
          If you have questions regarding this Privacy Policy or need more help,
          you may contact the CAPACLOUD CORP team.
        </p>
      </GlassPanel>
    </div>
  );
}
