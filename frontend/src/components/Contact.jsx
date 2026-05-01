import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Mail, MessageCircle, Loader2, X } from 'lucide-react';
import { brand, submitContactMock } from '../mock';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';

const Contact = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const onChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openForm = () => {
    setFormOpen(true);
    // Smooth-scroll the form into view after it mounts
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus first field for immediate interaction
      const first = formRef.current?.querySelector('input[name="name"]');
      first?.focus({ preventScroll: true });
    }, 420);
  };

  const closeForm = () => setFormOpen(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please add your name, email and a short message.');
      return;
    }
    // Light email sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('That email looks off — mind double-checking?');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMock(form);
      toast.success('Message received. I’ll reply within two working days.');
      setForm({ name: '', email: '', message: '' });
      // Collapse the form again after a short pause
      setTimeout(() => setFormOpen(false), 900);
    } catch (err) {
      toast.error('Something went wrong. Try WhatsApp instead.');
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hi Rhys — I’d like to chat about a project.'
  )}`;

  return (
    <section
      id="contact"
      className="py-24 md:py-32 border-t border-[#1f1f1f] relative overflow-hidden"
    >
      {/* Soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(closest-side, rgba(227,73,78,0.4), rgba(227,73,78,0) 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative">
        {/* Section header — centred for a clean editorial feel */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-5">
            § Start a project
          </div>
          <h2 className="font-display-xl text-4xl md:text-7xl text-[#f2ece2]">
            Let’s make something <br className="hidden md:block" />
            <span className="text-[#e3494e]">worth talking about.</span>
          </h2>
          <p className="mt-6 text-[#c9c2b5] leading-relaxed text-[15px] md:text-[17px] font-light max-w-xl mx-auto">
            Pick the channel that suits you best. I reply personally to every enquiry within two
            working days.
          </p>
        </div>

        {/* Dual CTA buttons */}
        <div className="mt-12 md:mt-14 grid sm:grid-cols-2 gap-4 md:gap-5 max-w-2xl mx-auto">
          {/* Send an Email — toggles the form */}
          <button
            type="button"
            onClick={openForm}
            aria-expanded={formOpen}
            aria-controls="email-form-panel"
            className={`group relative overflow-hidden rounded-full h-16 px-7 inline-flex items-center justify-center gap-3 font-sub text-[12px] transition-all duration-500 border ${
              formOpen
                ? 'bg-[#e3494e] border-[#e3494e] text-white'
                : 'bg-[#e3494e] border-[#e3494e] text-white hover:bg-[#c93b3f] hover:border-[#c93b3f]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Send an Email</span>
            <ArrowUpRight
              className={`w-4 h-4 transition-transform duration-500 ${
                formOpen ? 'rotate-45' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
              }`}
            />
          </button>

          {/* WhatsApp — direct link */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="group rounded-full h-16 px-7 inline-flex items-center justify-center gap-3 font-sub text-[12px] border border-[#2f2a23] bg-transparent text-[#f2ece2] hover:border-[#e3494e] hover:text-[#e3494e] transition-all duration-500"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message on WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Direct email & phone details — always visible, quiet */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[12px] text-[#8a8378] font-mono uppercase tracking-[0.18em]">
          <a
            href={`mailto:${brand.email}`}
            className="hover:text-[#e3494e] transition-colors"
          >
            {brand.email}
          </a>
          <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#e3494e] transition-colors"
          >
            {brand.whatsappDisplay}
          </a>
          <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
          <span>{brand.location}</span>
        </div>

        {/* Email form panel — hidden by default, fades in */}
        <div
          id="email-form-panel"
          ref={formRef}
          className={`grid transition-all duration-700 ease-out ${
            formOpen
              ? 'grid-rows-[1fr] opacity-100 mt-16'
              : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
          }`}
          aria-hidden={!formOpen}
        >
          <div className="overflow-hidden">
            <form
              onSubmit={onSubmit}
              className={`max-w-3xl mx-auto bg-[#141414] border border-[#2a2a2a] rounded-sm p-6 md:p-10 relative transform transition-all duration-700 ease-out ${
                formOpen ? 'translate-y-0' : 'translate-y-6'
              }`}
            >
              {/* Close */}
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#8a8378] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#e3494e] mb-3">
                  § Email enquiry
                </div>
                <h3 className="font-display uppercase tracking-tight text-2xl md:text-3xl text-[#f2ece2] font-bold">
                  Tell me about your project
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="font-sub text-[11px] text-[#8a8378]"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange('name')}
                    placeholder="Alex Carter"
                    className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-12 px-0 text-[#f2ece2] text-base placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-sub text-[11px] text-[#8a8378]"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange('email')}
                    placeholder="you@company.com"
                    className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-12 px-0 text-[#f2ece2] text-base placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="font-sub text-[11px] text-[#8a8378]"
                  >
                    Message / Request
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange('message')}
                    placeholder="A few sentences on what you’re building, timeline, and anything on your mind…"
                    rows={5}
                    className="bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] text-base placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e] transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
                <p className="text-[12px] text-[#5c564c] max-w-sm font-light leading-relaxed">
                  By sending, you agree I may contact you about your enquiry. No lists, no spam.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-14 px-8 font-sub text-[12px] transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send enquiry
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
