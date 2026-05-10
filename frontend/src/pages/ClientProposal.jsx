import React, { useEffect, useState } from 'react';
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
  X,
  HelpCircle,
  XOctagon,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getProposal, brand, formatProposalDate, formatValidUntil } from '../mock';
import { apiGetProposal, apiPostAction, resolveAsset } from '../lib/api';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
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
  const [proposal, setProposal] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  // Action flow state
  // null | 'approve-pending' | 'approved' | 'declined-done'
  const [flow, setFlow] = useState(null);
  const [openPanel, setOpenPanel] = useState(null); // 'revision' | 'decline' | null
  const [revisionForm, setRevisionForm] = useState({ name: '', question: '' });
  const [declineFeedback, setDeclineFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load proposal from API; fall back to local mock if API is unreachable
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setFetching(true);
      setNotFound(false);
      try {
        const remote = await apiGetProposal(slug);
        if (cancelled) return;
        setProposal(remote);
      } catch (e) {
        // 404 → genuinely missing
        if (e?.response?.status === 404) {
          // Try mock fallback for legacy slug
          const fallback = getProposal(slug);
          if (fallback) {
            if (!cancelled) setProposal(fallback);
          } else {
            if (!cancelled) setNotFound(true);
          }
        } else {
          // Network/other error — fall back to local mock so preview never breaks
          const fallback = getProposal(slug);
          if (fallback) {
            if (!cancelled) setProposal(fallback);
          } else {
            if (!cancelled) setNotFound(true);
          }
        }
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Once proposal loads, pick default tier
  useEffect(() => {
    if (!proposal) return;
    const tiers = proposal.investment?.tiers || [];
    const featured = tiers.find((t) => t.featured) || tiers[0];
    if (featured) setSelectedTier(featured.name);
  }, [proposal]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
          Loading proposal…
        </span>
      </div>
    );
  }

  if (notFound || !proposal) return <NotFound />;

  const fireConfetti = () => {
    const colors = ['#e3494e', '#f2ece2', '#d4a554', '#ffffff'];
    confetti({
      particleCount: 90,
      spread: 70,
      angle: 60,
      origin: { x: 0.1, y: 0.7 },
      colors,
      scalar: 1.1,
      ticks: 220,
    });
    confetti({
      particleCount: 90,
      spread: 70,
      angle: 120,
      origin: { x: 0.9, y: 0.7 },
      colors,
      scalar: 1.1,
      ticks: 220,
    });
    setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 100,
        startVelocity: 38,
        origin: { x: 0.5, y: 0.3 },
        colors,
        ticks: 260,
      });
    }, 280);
  };

  const handleDownloadPdf = () => {
    toast.message('Opening print dialog — choose “Save as PDF”.');
    setTimeout(() => window.print(), 300);
  };

  const handleApprove = async () => {
    setFlow('approve-pending');
    setOpenPanel(null);
    try {
      await apiPostAction(proposal.slug, {
        action: 'approve',
        tier: selectedTier,
      });
      fireConfetti();
      setFlow('approved');
      toast.success(`Approval logged — Rhys has been notified. Tier: ${selectedTier}.`);
    } catch {
      setFlow(null);
      toast.error('Something went wrong. Please email or WhatsApp to confirm instead.');
    }
  };

  const handleRevisionSubmit = async (e) => {
    e.preventDefault();
    if (!revisionForm.question.trim()) {
      toast.error('Add a quick note so Rhys knows what to revise.');
      return;
    }
    setSubmitting(true);
    try {
      await apiPostAction(proposal.slug, {
        action: 'revision',
        tier: selectedTier,
        payload: revisionForm,
      });
      toast.success('Sent — Rhys will reply within one working day.');
      setRevisionForm({ name: '', question: '' });
      setOpenPanel(null);
    } catch {
      toast.error('Something went wrong. Try WhatsApp instead.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclineSubmit = async () => {
    setSubmitting(true);
    try {
      await apiPostAction(proposal.slug, {
        action: 'decline',
        tier: selectedTier,
        payload: { feedback: declineFeedback.trim() },
      });
      setFlow('declined-done');
      setOpenPanel(null);
      toast.success('Thank you — your feedback has been logged.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Rhys — re: proposal ${proposal.reference} for ${proposal.client}.`
  )}`;
  const mailLink = `mailto:${brand.email}?subject=${encodeURIComponent(
    `Proposal ${proposal.reference} — ${proposal.client}`
  )}`;

  // Live-current dates (re-computed on each render unless overridden in proposal data)
  const displayPreparedDate = proposal.preparedDate || formatProposalDate();
  const displayValidUntil = proposal.validUntil || formatValidUntil(60);

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

      {/* Full-bleed hero cover with image + dark overlay */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] print:border-neutral-300">
        {proposal.coverImage && (
          <>
            <img
              src={resolveAsset(proposal.coverImage)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover print:hidden"
              loading="eager"
            />
            {/* Dark luxury overlay — strong, fades into the page background */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/85 via-[#0f0f0f]/82 to-[#0f0f0f] print:hidden"
            />
            {/* Subtle red accent bloom in the corner */}
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 print:hidden"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(227,73,78,0.45), rgba(227,73,78,0) 70%)',
              }}
            />
          </>
        )}
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-28 print:py-10">
          <div className="grid md:grid-cols-12 gap-8 md:gap-14">
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
              <p className="mt-8 text-[17px] text-[#d8d2c6] print:text-neutral-700 leading-relaxed font-light max-w-2xl">
                {proposal.intro}
              </p>
            </div>
            <aside className="md:col-span-4 md:pt-14">
              <dl className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-4 text-[13px]">
                {[
                  ['Prepared for', proposal.preparedFor],
                  ['Prepared by', proposal.preparedBy],
                  ['Date', displayPreparedDate],
                  ['Valid until', displayValidUntil],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-[#3a3a3a] print:border-neutral-300 pt-3">
                    <dt className="font-sub text-[10px] text-[#a8a195] print:text-neutral-600 mb-1">{k}</dt>
                    <dd className="text-[#f2ece2] print:text-black font-light">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-20 print:py-8">

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
              {proposal.scope.summary && (
                <p className="mt-5 text-[14px] text-[#c9c2b5] print:text-neutral-700 font-light leading-relaxed max-w-md">
                  {proposal.scope.summary}
                </p>
              )}
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

        {/* Initial Ideas */}
        <section className="py-16 md:py-24 border-b border-[#1f1f1f]">
          <div className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § 02 Initial Ideas
            </div>
            <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2] print:text-black max-w-3xl">
              A few <span className="text-[#e3494e]">starting points.</span>
            </h2>
            <p className="mt-5 text-[15px] text-[#a8a195] print:text-neutral-700 font-light max-w-2xl leading-relaxed">
              Not committed to any of these — just a handful of early thoughts to set the
              conversation in motion. We’ll narrow, refine and pick a direction together once we’re
              working.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {proposal.concepts.map((c, i) => (
              <article key={i} className="group">
                <div className="img-tile rounded-sm overflow-hidden">
                  <img
                    src={resolveAsset(c.image)}
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

        {/* Actions — 3-button flow */}
        <section className="py-16 md:py-24 relative overflow-hidden print:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 w-[460px] h-[460px] rounded-full blur-3xl opacity-25"
            style={{
              background:
                'radial-gradient(closest-side, rgba(227,73,78,0.45), rgba(227,73,78,0) 70%)',
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            {/* Heading swaps based on flow state */}
            {flow === 'approved' ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9cd3af] mb-4">
                  <PartyPopper className="w-3.5 h-3.5" />
                  Approved
                </div>
                <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2]">
                  Welcome aboard <span className="text-[#e3494e]">— let’s get to work.</span>
                </h2>
                <p className="mt-5 text-[15px] text-[#c9c2b5] font-light max-w-xl mx-auto leading-relaxed">
                  Your approval of the{' '}
                  <span className="text-[#e3494e] font-sub text-[12px]">
                    {selectedTier?.toUpperCase()}
                  </span>{' '}
                  tier has been logged and Rhys has been notified. You’ll receive the engagement
                  agreement and first invoice within 24 hours.
                </p>
                <button
                  onClick={handleDownloadPdf}
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-transparent border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download a PDF copy
                </button>
              </div>
            ) : flow === 'declined-done' ? (
              <div className="text-center">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
                  § Proposal declined
                </div>
                <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2]">
                  Thank you for the <span className="text-[#e3494e]">honest read.</span>
                </h2>
                <p className="mt-5 text-[15px] text-[#c9c2b5] font-light max-w-xl mx-auto leading-relaxed">
                  Your decision and any feedback have been logged. If anything changes, the
                  proposal stays valid until {proposal.validUntil}.
                </p>
              </div>
            ) : (
              <div className="text-center">
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
                  . Choose how you’d like to respond — Rhys is notified the moment you do.
                </p>

                {/* The 3 buttons */}
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* 1. Approve — Primary */}
                  <button
                    onClick={handleApprove}
                    disabled={flow === 'approve-pending'}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full h-14 px-6 bg-[#e3494e] hover:bg-[#c93b3f] text-white font-sub text-[12px] disabled:opacity-70 transition-colors lg:order-1 sm:col-span-2 lg:col-span-1"
                  >
                    {flow === 'approve-pending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Approving…
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Approve Proposal
                        <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* 2. Request Revisions — Secondary */}
                  <button
                    onClick={() =>
                      setOpenPanel(openPanel === 'revision' ? null : 'revision')
                    }
                    aria-expanded={openPanel === 'revision'}
                    className={`inline-flex items-center justify-center gap-2 rounded-full h-14 px-6 font-sub text-[12px] border transition-colors lg:order-2 ${
                      openPanel === 'revision'
                        ? 'bg-[#141414] border-[#e3494e] text-[#e3494e]'
                        : 'bg-transparent border-[#2a2a2a] text-[#f2ece2] hover:border-[#e3494e] hover:text-[#e3494e]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Request Revisions
                  </button>

                  {/* 3. Decline — Tertiary */}
                  <button
                    onClick={() =>
                      setOpenPanel(openPanel === 'decline' ? null : 'decline')
                    }
                    aria-expanded={openPanel === 'decline'}
                    className={`inline-flex items-center justify-center gap-2 rounded-full h-14 px-6 font-sub text-[11px] transition-colors lg:order-3 ${
                      openPanel === 'decline'
                        ? 'text-[#e3494e]'
                        : 'text-[#8a8378] hover:text-[#e3494e]'
                    }`}
                  >
                    <XOctagon className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>

                {/* Inline panel — Request Revisions */}
                <div
                  className={`grid transition-all duration-700 ease-out text-left ${
                    openPanel === 'revision'
                      ? 'grid-rows-[1fr] opacity-100 mt-8'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <form
                      onSubmit={handleRevisionSubmit}
                      className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-6 md:p-8 relative"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenPanel(null)}
                        aria-label="Close revisions panel"
                        className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#8a8378] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#e3494e] mb-2">
                        § Ask a question or request a revision
                      </div>
                      <h3 className="font-display uppercase tracking-tight text-xl md:text-2xl text-[#f2ece2] font-bold">
                        What would you like changed?
                      </h3>
                      <p className="mt-2 text-[13px] text-[#a8a195] font-light max-w-lg">
                        A line or two is plenty. If it’s easier to talk it through,{' '}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#e3494e] hover:underline"
                        >
                          message on WhatsApp
                        </a>{' '}
                        instead.
                      </p>

                      <div className="mt-6 space-y-5">
                        <div className="space-y-2">
                          <Label className="font-sub text-[11px] text-[#8a8378]">
                            Your name (optional)
                          </Label>
                          <Input
                            value={revisionForm.name}
                            onChange={(e) =>
                              setRevisionForm({ ...revisionForm, name: e.target.value })
                            }
                            placeholder="Harriet Ashworth"
                            className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-sub text-[11px] text-[#8a8378]">
                            Your question or revision request
                          </Label>
                          <Textarea
                            value={revisionForm.question}
                            onChange={(e) =>
                              setRevisionForm({ ...revisionForm, question: e.target.value })
                            }
                            placeholder="e.g. Can we talk through Concept 02 vs 04? And how does the SEO retainer fit in the Growth tier?"
                            rows={4}
                            className="bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 font-sub text-[11px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Or jump straight to WhatsApp
                        </a>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                            </>
                          ) : (
                            <>
                              Send to Rhys
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Inline panel — Decline */}
                <div
                  className={`grid transition-all duration-700 ease-out text-left ${
                    openPanel === 'decline'
                      ? 'grid-rows-[1fr] opacity-100 mt-8'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-6 md:p-8 relative">
                      <button
                        type="button"
                        onClick={() => setOpenPanel(null)}
                        aria-label="Close decline panel"
                        className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#8a8378] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-2">
                        § Not the right fit?
                      </div>
                      <h3 className="font-display uppercase tracking-tight text-xl md:text-2xl text-[#f2ece2] font-bold">
                        A quick line on why?
                      </h3>
                      <p className="mt-2 text-[13px] text-[#a8a195] font-light max-w-lg">
                        Honest feedback genuinely helps. One sentence is enough — pricing,
                        timing, scope, or something else entirely.
                      </p>

                      <div className="mt-5 space-y-2">
                        <Label className="font-sub text-[11px] text-[#8a8378]">
                          Brief feedback (optional)
                        </Label>
                        <Textarea
                          value={declineFeedback}
                          onChange={(e) => setDeclineFeedback(e.target.value)}
                          placeholder="e.g. Pricing is over budget for this stage / timing isn’t right / decided to keep in-house…"
                          rows={3}
                          className="bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                        />
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setOpenPanel(null)}
                          className="inline-flex items-center justify-center gap-2 font-sub text-[11px] text-[#8a8378] hover:text-[#f2ece2] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDeclineSubmit}
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#3a3a3a] hover:border-[#e3494e] hover:text-[#e3494e] disabled:opacity-60 text-[#d8d2c6] rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                            </>
                          ) : (
                            <>
                              Send & decline
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiet meta — always visible while not approved/declined */}
            {flow !== 'approved' && flow !== 'declined-done' && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-[#8a8378] font-mono uppercase tracking-[0.18em]">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 hover:text-[#e3494e] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
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
            )}
          </div>
        </section>

        {/* Print footer — only shows when printing */}
        <section className="hidden print:block pt-8 border-t border-neutral-300 text-[11px] text-neutral-600">
          <div className="flex justify-between">
            <span>
              {proposal.client} · {proposal.projectTitle}
            </span>
            <span>
              {proposal.reference} · {displayPreparedDate}
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
            Proposal v1.0 · {displayPreparedDate}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ClientProposal;
