import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { apiGetSiteContent, apiUpdateSiteContent } from '../lib/api';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const inputCls =
  'bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]';
const textareaCls =
  'bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]';
const sectionCls = 'border-t border-[#1f1f1f] py-10';
const labelCls = 'font-sub text-[11px] text-[#8a8378]';

const emptyContent = () => ({
  hero: { headlineLines: ['', '', ''], subcopy: '' },
  about: { heading: '', headingAccent: '', body: ['', ''] },
  services: [
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ],
  process: [
    { title: '', body: '' },
    { title: '', body: '' },
    { title: '', body: '' },
    { title: '', body: '' },
  ],
  contact: { email: '', whatsapp: '', whatsappDisplay: '' },
});

const SiteContentEditor = () => {
  const { refresh } = useSiteContent();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Block search engines
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGetSiteContent();
      // Normalise shapes to ensure form-controlled inputs never get undefined
      setForm({
        hero: {
          headlineLines:
            Array.isArray(data.hero?.headlineLines) && data.hero.headlineLines.length === 3
              ? data.hero.headlineLines
              : ['', '', ''],
          subcopy: data.hero?.subcopy || '',
        },
        about: {
          heading: data.about?.heading || '',
          headingAccent: data.about?.headingAccent || '',
          body:
            Array.isArray(data.about?.body) && data.about.body.length >= 2
              ? data.about.body.slice(0, 2)
              : ['', ''],
        },
        services:
          Array.isArray(data.services) && data.services.length === 4
            ? data.services.map((s) => ({
                title: s.title || '',
                description: s.description || '',
              }))
            : emptyContent().services,
        process:
          Array.isArray(data.process) && data.process.length === 4
            ? data.process.map((p) => ({
                title: p.title || '',
                body: p.body || '',
              }))
            : emptyContent().process,
        contact: {
          email: data.contact?.email || '',
          whatsapp: data.contact?.whatsapp || '',
          whatsappDisplay: data.contact?.whatsappDisplay || '',
        },
      });
    } catch (e) {
      toast.error('Could not load site content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiUpdateSiteContent(form);
      await refresh(); // Re-pull so the public site updates immediately
      toast.success('Site content saved — the homepage is updated.');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 font-sub text-[11px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <div className="h-6 w-px bg-[#2a2a2a]" />
            <span className="font-sub text-[10px] text-[#8a8378] truncate">
              Site Content — Homepage
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View live
            </a>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 font-sub text-[10px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
              title="Discard local changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-3">
            Site Content
          </div>
          <h1 className="font-display-xl text-4xl md:text-5xl">
            Edit the <span className="text-[#e3494e]">homepage.</span>
          </h1>
          <p className="mt-4 text-[14px] text-[#a8a195] font-light max-w-2xl leading-relaxed">
            Changes save instantly. The public site re-fetches on the next visit
            — hit Refresh on any open tabs to see updates.
          </p>
        </div>

        {/* ===== HERO ===== */}
        <section className="pb-2">
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Hero section</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Three lines of headline (the third line is shown in the red accent
            colour) plus a one-paragraph sub-headline.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Label className={labelCls}>
                  Headline line {i + 1}
                  {i === 2 && (
                    <span className="ml-2 text-[#e3494e]">(accent)</span>
                  )}
                </Label>
                <Input
                  value={form.hero.headlineLines[i] || ''}
                  onChange={(e) => {
                    const lines = [...form.hero.headlineLines];
                    lines[i] = e.target.value;
                    setForm({
                      ...form,
                      hero: { ...form.hero, headlineLines: lines },
                    });
                  }}
                  className={inputCls}
                  placeholder={
                    i === 0 ? 'Where strategy' : i === 1 ? 'meets' : 'craft.'
                  }
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label className={labelCls}>Sub-headline</Label>
            <Textarea
              rows={3}
              value={form.hero.subcopy}
              onChange={(e) =>
                setForm({
                  ...form,
                  hero: { ...form.hero, subcopy: e.target.value },
                })
              }
              className={textareaCls}
              placeholder="Elevating brands through digital-led marketing…"
            />
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">About section</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            The heading is split into two lines — the accent line shows in red.
            Bio is two paragraphs.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className={labelCls}>Heading (line 1)</Label>
              <Input
                value={form.about.heading}
                onChange={(e) =>
                  setForm({ ...form, about: { ...form.about, heading: e.target.value } })
                }
                className={inputCls}
                placeholder="Agency-level expertise."
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>
                Heading accent (line 2) <span className="text-[#e3494e]">(red)</span>
              </Label>
              <Input
                value={form.about.headingAccent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    about: { ...form.about, headingAccent: e.target.value },
                  })
                }
                className={inputCls}
                placeholder="Without the agency overhead."
              />
            </div>
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2 mb-5">
              <Label className={labelCls}>Bio paragraph {i + 1}</Label>
              <Textarea
                rows={4}
                value={form.about.body[i] || ''}
                onChange={(e) => {
                  const body = [...form.about.body];
                  body[i] = e.target.value;
                  setForm({ ...form, about: { ...form.about, body } });
                }}
                className={textareaCls}
                placeholder="With over 15 years in the creative industry…"
              />
            </div>
          ))}
        </section>

        {/* ===== SERVICES ===== */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Services (4 blocks)</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Edit the four service titles and descriptions. Deliverable bullets
            are managed in the code template for now.
          </p>
          <div className="space-y-5">
            {form.services.map((s, i) => (
              <div
                key={i}
                className="border border-[#2a2a2a] rounded-sm p-5 grid md:grid-cols-[120px_1fr] gap-4 items-start"
              >
                <div className="font-mono text-[12px] text-[#e3494e] md:pt-3">
                  Service 0{i + 1}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className={labelCls}>Title</Label>
                    <Input
                      value={s.title}
                      onChange={(e) => {
                        const services = [...form.services];
                        services[i] = { ...services[i], title: e.target.value };
                        setForm({ ...form, services });
                      }}
                      className={inputCls}
                      placeholder="Brand Identity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelCls}>Description</Label>
                    <Textarea
                      rows={3}
                      value={s.description}
                      onChange={(e) => {
                        const services = [...form.services];
                        services[i] = {
                          ...services[i],
                          description: e.target.value,
                        };
                        setForm({ ...form, services });
                      }}
                      className={textareaCls}
                      placeholder="Logos, wordmarks, systems and guidelines…"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">
            Process — The 4D Framework
          </h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Edit the four steps: Discover, Define, Deliver, Develop.
          </p>
          <div className="space-y-5">
            {form.process.map((p, i) => (
              <div
                key={i}
                className="border border-[#2a2a2a] rounded-sm p-5 grid md:grid-cols-[120px_1fr] gap-4 items-start"
              >
                <div className="font-mono text-[12px] text-[#e3494e] md:pt-3">
                  0{i + 1}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className={labelCls}>Step title</Label>
                    <Input
                      value={p.title}
                      onChange={(e) => {
                        const process = [...form.process];
                        process[i] = { ...process[i], title: e.target.value };
                        setForm({ ...form, process });
                      }}
                      className={inputCls}
                      placeholder={
                        ['Discover', 'Define', 'Deliver', 'Develop'][i]
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelCls}>Step body</Label>
                    <Textarea
                      rows={3}
                      value={p.body}
                      onChange={(e) => {
                        const process = [...form.process];
                        process[i] = { ...process[i], body: e.target.value };
                        setForm({ ...form, process });
                      }}
                      className={textareaCls}
                      placeholder="I dive deep into your brief…"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Contact info</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Updates email, WhatsApp link, and the displayed number across the
            site, footer, and every proposal page.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className={labelCls}>Email</Label>
              <Input
                value={form.contact.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, email: e.target.value },
                  })
                }
                className={inputCls}
                placeholder="hello@rhysmorgan.studio"
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>
                WhatsApp (international format, no spaces)
              </Label>
              <Input
                value={form.contact.whatsapp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, whatsapp: e.target.value },
                  })
                }
                className={inputCls + ' font-mono'}
                placeholder="+447930577757"
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>WhatsApp — displayed</Label>
              <Input
                value={form.contact.whatsappDisplay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: {
                      ...form.contact,
                      whatsappDisplay: e.target.value,
                    },
                  })
                }
                className={inputCls}
                placeholder="07930 577 757"
              />
            </div>
          </div>
        </section>

        {/* Bottom save */}
        <div className="mt-12 flex items-center justify-between gap-3 flex-wrap pt-8 border-t border-[#1f1f1f]">
          <Link
            to="/admin"
            className="font-sub text-[11px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
          >
            ← Back to dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save & publish to site
          </button>
        </div>
      </main>
    </div>
  );
};

export default SiteContentEditor;
