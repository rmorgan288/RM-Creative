import React, { useState } from 'react';
import { ArrowUpRight, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { brand, submitContactMock } from '../mock';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const budgets = [
  'Under £5k',
  '£5k — £15k',
  '£15k — £40k',
  '£40k+',
  'Not sure yet',
];

const projectTypes = [
  'Brand Identity',
  'Website',
  'Creative Direction',
  'Print / Editorial',
  'Other',
];

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please add your name, email and a short message.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMock(form);
      toast.success('Message received. I’ll reply within two working days.');
      setForm({ name: '', email: '', company: '', projectType: '', budget: '', message: '' });
    } catch (err) {
      toast.error('Something went wrong. Try email or WhatsApp below.');
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Rhys — I’d like to chat about a project.')}`;
  const mailLink = `mailto:${brand.email}?subject=${encodeURIComponent('New project enquiry')}`;

  return (
    <section id="contact" className="py-24 md:py-32 border-t border-[#1f1f1f] relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(closest-side, rgba(227,73,78,0.4), rgba(227,73,78,0) 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Left pitch + direct contact */}
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § Start a project
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1] text-[#f2ece2]">
              Let’s make something <em className="italic text-[#e3494e]">worth talking about.</em>
            </h2>
            <p className="mt-6 text-[#c9c2b5] leading-relaxed max-w-md">
              Tell me a bit about your brand and where you’d like to take it. I reply personally
              to every enquiry within two working days.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href={mailLink}
                className="group flex items-center justify-between gap-4 border-t border-[#2a2a2a] pt-5 hover:border-[#e3494e] transition-colors"
              >
                <span className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#e3494e]" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Email</span>
                    <span className="block font-display text-xl text-[#f2ece2] group-hover:text-[#e3494e] transition-colors">
                      {brand.email}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8378] group-hover:text-[#e3494e] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-t border-[#2a2a2a] pt-5 hover:border-[#e3494e] transition-colors"
              >
                <span className="flex items-center gap-4">
                  <MessageCircle className="w-5 h-5 text-[#e3494e]" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">WhatsApp</span>
                    <span className="block font-display text-xl text-[#f2ece2] group-hover:text-[#e3494e] transition-colors">
                      {brand.whatsappDisplay}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8378] group-hover:text-[#e3494e] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>

              <div className="border-t border-[#2a2a2a] pt-5">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Studio</span>
                <span className="block font-display text-xl text-[#f2ece2] mt-1">{brand.location}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="md:col-span-7 bg-[#141414] border border-[#1f1f1f] rounded-sm p-6 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Your name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="Alex Carter"
                  className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  placeholder="you@company.com"
                  className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Company (optional)</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={onChange('company')}
                  placeholder="Butterflies Bar & Kitchen"
                  className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Project type</Label>
                <Select value={form.projectType} onValueChange={(v) => setForm({ ...form, projectType: v })}>
                  <SelectTrigger className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] focus:ring-0 focus:border-[#e3494e]">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2a2a2a] text-[#f2ece2]">
                    {projectTypes.map((t) => (
                      <SelectItem key={t} value={t} className="focus:bg-[#e3494e] focus:text-white">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Approx. budget</Label>
                <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
                  <SelectTrigger className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] focus:ring-0 focus:border-[#e3494e]">
                    <SelectValue placeholder="Pick a range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2a2a2a] text-[#f2ece2]">
                    {budgets.map((b) => (
                      <SelectItem key={b} value={b} className="focus:bg-[#e3494e] focus:text-white">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message" className="text-[11px] uppercase tracking-[0.18em] text-[#8a8378]">Tell me about the project</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={onChange('message')}
                  placeholder="A few sentences on what you’re building, timeline, anything on your mind…"
                  rows={5}
                  className="bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
              <p className="text-[12px] text-[#5c564c] max-w-sm">
                By sending, you agree I may contact you about your enquiry. No lists, no spam.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-13 min-h-[52px] px-8 text-[14px] tracking-wide transition-colors"
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
    </section>
  );
};

export default Contact;
