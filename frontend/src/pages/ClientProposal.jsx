import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowLeft,
  Download,
  Check,
  FileText,
  Mail,
  MessageCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { getProposal, acceptProposalMock, brand } from '../mock';
import { toast } from 'sonner';

const NotFound = () => (
  <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] flex items-center justify-center px-6">
    <div className="max-w-md text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
        § 404 — Proposal not found
      </div>
      <h1 className="font-display-xl text-4xl md:text-5xl mb-6">
        This proposal is <span className="text-[#e3494e]">private</span> or has moved.
      </h1>
      <p className="text-[#a8a195] font-light mb-8 leading-relaxed">
        Client proposals live at unique, unlisted URLs. If you were expecting one, please check the
        link in your email or get in touch directly.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to main site
      </Link>
    </div>
  </div>
);

const ClientProposal = () => {
  const { slug } = useParams();
  const proposal = getProposal(slug);
  const [selectedTier, setSelectedTier] = useState(
    proposal ? proposal.investment.tiers.find((t) => t.featured)?.name || proposal.investment.tiers[0].name : null
  );
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!proposal) return <NotFound />;

  const handleDownloadPdf = () => {
    toast.message('Opening print dialog — choose “Save as PDF”.');
    setTimeout(() => window.print(), 300);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await acceptProposalMock(proposal.slug, selectedTier);
      setConfirmed(true);
      toast.success(`Thank you — your acceptance of the “${selectedTier}” tier has been logged.`);
    } catch {
      toast.error('Something went wrong. Please email or WhatsApp to confirm instead.');
    } finally {
      setConfirming(false);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Rhys — re: proposal ${proposal.reference} for ${proposal.client}.`
  )}`;
  const mailLink = `mailto:${brand.email}?subject=${encodeURIComponent(
    `Proposal ${proposal.reference} — ${proposal.client}`
  )}`;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] print:bg-white print:text-black">
      {/* Proposal header bar (replaces site nav) */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#1f1f1f] print:hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png"
              alt="Rhys Morgan"
              className="h-7 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-[#2a2a2a]" />
            <span className="hidden sm:inline font-sub text-[10px] text-[#8a8378]">
              Client Proposal
            </span>
            <span className="inline-flex items-center gap-1.5 ml-1 sm:ml-2 font-sub text-[10px] text-[#e3494e]">
              <Lock className="w-3 h-3" /> {proposal.status}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-2 font-sub text-[10px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-20 print:py-8">
        {/* Cover */}
        <section className="grid md:grid-cols-12 gap-8 md:gap-14 pb-16 md:pb-24 border-b border-[#1f1f1f]">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-5">
              § Proposal · {proposal.reference}
            </div>
            <h1 className="font-display-xl text-5xl md:text-7xl leading-[0.95] text-[#f2ece2] print:text-black">
              {proposal.client}
            </h1>
            <h2 className="mt-6 font-display uppercase tracking-tight text-xl md:text-2xl text-[#e3494e] font-bold">
              {proposal.projectTitle}
            </h2>
            <p className="mt-8 text-[17px] text-[#c9c2b5] print:text-neutral-700 leading-relaxed font-light max-w-2xl">
              {proposal.intro}
            </p>
          </div>
          <aside className="md:col-span-4 md:pt-14">
            <dl className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-4 text-[13px]">
              {[
                ['Prepared for', proposal.preparedFor],
                ['Prepared by', proposal.preparedBy],
                ['Date', proposal.preparedDate],
                ['Valid until', proposal.validUntil],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-[#2a2a2a] pt-3">
                  <dt className="font-sub text-[10px] text-[#8a8378] mb-1">{k}</dt>
                  <dd className="text-[#f2ece2] print:text-black font-light">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {/* Project Scope */}
        <section className="py-16 md:py-24 border-b border-[#1f1f1f]">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
                § 01 Project Scope
              </div>
              <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2] print:text-black">
                What we’re <span className="text-[#e3494e]">setting out to do.</span>
              </h2>
            </div>
            <div className="md:col-span-8 space-y-12">
              {/* Goals */}
              <div>
                <div className="font-sub text-[11px] text-[#8a8378] mb-5">Goals</div>
                <ul className="space-y-3">
                  {proposal.scope.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] text-[#d8d2c6] print:text-neutral-800 font-light leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-[#e3494e] shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Deliverables */}
              <div>
                <div className="font-sub text-[11px] text-[#8a8378] mb-5">Deliverables</div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {proposal.scope.deliverables.map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-3 text-[14px] text-[#d8d2c6] print:text-neutral-800 font-light border-t border-[#2a2a2a] pt-2.5"
                    >
                      <Check className="w-3.5 h-3.5 text-[#e3494e]" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
              {/* Timeline */}
              <div>
                <div className="font-sub text-[11px] text-[#8a8378] mb-5">Timeline</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded-sm overflow-hidden">
                  {proposal.scope.timeline.map((t) => (
                    <div key={t.phase} className="bg-[#0f0f0f] print:bg-white p-5">
                      <div className="font-mono text-[11px] text-[#e3494e] mb-2">{t.weeks}</div>
                      <div className="font-display uppercase tracking-wider text-sm text-[#f2ece2] print:text-black font-bold">
                        {t.phase}
                      </div>
                      <p className="mt-2 text-[12px] text-[#a8a195] print:text-neutral-700 font-light leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Concepts */}
        <section className="py-16 md:py-24 border-b border-[#1f1f1f]">
          <div className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § 02 Design Concepts
            </div>
            <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2] print:text-black max-w-3xl">
              Four directions, <span className="text-[#e3494e]">one brand.</span>
            </h2>
            <p className="mt-5 text-[15px] text-[#a8a195] print:text-neutral-700 font-light max-w-2xl">
              Starting points rather than finished work. We’ll narrow to one direction in the
              Define phase, then build the full system around it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {proposal.concepts.map((c, i) => (
              <article key={i} className="group">
                <div className="img-tile rounded-sm overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-[44vh] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5">
                  <div className="font-sub text-[11px] text-[#e3494e] mb-2">{c.name}</div>
                  <p className="text-[14px] text-[#c9c2b5] print:text-neutral-800 font-light leading-relaxed">
                    {c.direction}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Investment */}
        <section className="py-16 md:py-24 border-b border-[#1f1f1f]">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
                § 03 Investment
              </div>
              <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2] print:text-black">
                Three <span className="text-[#e3494e]">tiers.</span>
              </h2>
            </div>
            <p className="max-w-md text-[13px] text-[#8a8378] font-light leading-relaxed">
              {proposal.investment.note}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {proposal.investment.tiers.map((t) => {
              const isSelected = selectedTier === t.name;
              return (
                <article
                  key={t.name}
                  onClick={() => setSelectedTier(t.name)}
                  className={`relative cursor-pointer p-6 md:p-8 rounded-sm border transition-all duration-300 ${
                    isSelected
                      ? 'border-[#e3494e] bg-[#141414] shadow-[0_0_0_1px_rgba(227,73,78,0.4)]'
                      : 'border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#4a4a4a]'
                  } ${t.featured ? 'md:-translate-y-2' : ''}`}
                >
                  {t.featured && (
                    <span className="absolute -top-3 left-6 bg-[#e3494e] text-white font-sub text-[9px] rounded-full px-3 py-1">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-display uppercase tracking-wider text-lg text-[#f2ece2] print:text-black font-bold">
                      {t.name}
                    </h3>
                    <span className="font-sub text-[10px] text-[#8a8378]">{t.tag}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-display-xl text-4xl md:text-5xl text-[#f2ece2] print:text-black">
                      {proposal.investment.currency}
                      {t.price}
                    </span>
                  </div>
                  <div className="font-sub text-[10px] text-[#8a8378] mb-5">per {t.cadence}</div>
                  <p className="text-[13px] text-[#c9c2b5] print:text-neutral-800 font-light leading-relaxed mb-5 border-t border-[#2a2a2a] pt-4">
                    {t.summary}
                  </p>
                  <ul className="space-y-2.5">
                    {t.includes.map((inc) => (
                      <li
                        key={inc}
                        className="flex items-start gap-3 text-[12px] text-[#d8d2c6] print:text-neutral-800 font-light"
                      >
                        <Check className="w-3.5 h-3.5 text-[#e3494e] mt-0.5 shrink-0" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`mt-6 inline-flex items-center gap-2 font-sub text-[10px] ${
                      isSelected ? 'text-[#e3494e]' : 'text-[#8a8378]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full inline-flex items-center justify-center border ${
                        isSelected ? 'border-[#e3494e] bg-[#e3494e]' : 'border-[#3a3a3a]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    {isSelected ? 'Selected' : 'Select this tier'}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Terms */}
        <section className="py-12 border-b border-[#1f1f1f]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-5">
            § 04 Terms
          </div>
          <ul className="grid md:grid-cols-3 gap-6">
            {proposal.terms.map((t, i) => (
              <li
                key={i}
                className="text-[13px] text-[#a8a195] print:text-neutral-700 font-light leading-relaxed border-t border-[#2a2a2a] pt-4"
              >
                <span className="font-mono text-[11px] text-[#e3494e] mr-2">0{i + 1}.</span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <section className="py-16 md:py-24 relative overflow-hidden print:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 w-[460px] h-[460px] rounded-full blur-3xl opacity-25"
            style={{
              background:
                'radial-gradient(closest-side, rgba(227,73,78,0.45), rgba(227,73,78,0) 70%)',
            }}
          />
          <div className="relative text-center max-w-3xl mx-auto">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § Next step
            </div>
            <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2]">
              Ready to move forward?
            </h2>
            <p className="mt-5 text-[15px] text-[#c9c2b5] font-light max-w-xl mx-auto leading-relaxed">
              Your selected tier:{' '}
              <span className="text-[#e3494e] font-sub text-[12px]">
                {selectedTier?.toUpperCase()}
              </span>
              . Confirming below logs your acceptance — I’ll follow up personally within 24 hours
              with the engagement agreement and first invoice.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
              <button
                onClick={handleConfirm}
                disabled={confirming || confirmed}
                className={`inline-flex items-center justify-center gap-2 rounded-full h-14 px-8 font-sub text-[12px] transition-colors ${
                  confirmed
                    ? 'bg-[#1f3f2a] border border-[#2b5a3a] text-[#9cd3af]'
                    : 'bg-[#e3494e] hover:bg-[#c93b3f] text-white disabled:opacity-60'
                }`}
              >
                {confirmed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Acceptance logged
                  </>
                ) : confirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming…
                  </>
                ) : (
                  <>
                    Confirm & Proceed
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-14 px-8 font-sub text-[12px] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-[#8a8378] font-mono uppercase tracking-[0.18em]">
              <a
                href={mailLink}
                className="inline-flex items-center gap-2 hover:text-[#e3494e] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {brand.email}
              </a>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#e3494e] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {brand.whatsappDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Print footer — only shows when printing */}
        <section className="hidden print:block pt-8 border-t border-neutral-300 text-[11px] text-neutral-600">
          <div className="flex justify-between">
            <span>
              {proposal.client} · {proposal.projectTitle}
            </span>
            <span>
              {proposal.reference} · {proposal.preparedDate}
            </span>
          </div>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-[#1f1f1f] py-8 print:hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] text-[#5c564c]">
          <span>
            {proposal.reference} · Confidential — for {proposal.preparedFor.split(',')[0]} only.
          </span>
          <span className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Proposal v1.0 · {proposal.preparedDate}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ClientProposal;
