import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Loader2,
  Eye,
  Upload,
  ImageIcon,
  ExternalLink,
} from 'lucide-react';
import {
  apiCreateProposal,
  apiUpdateProposal,
  apiListProposals,
  apiUploadImage,
  resolveAsset,
} from '../lib/api';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

const slugify = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const emptyProposal = () => ({
  slug: '',
  status: 'draft',
  client: '',
  projectTitle: '',
  preparedFor: '',
  preparedBy: 'Rhys Morgan, Creative Marketing',
  preparedDate: null,
  validUntil: null,
  reference: '',
  coverImage: '',
  intro: '',
  scope: {
    summary: '',
    goals: [''],
    deliverables: [''],
    timeline: [
      { phase: 'Discover', weeks: 'Weeks 1–2', body: '' },
      { phase: 'Define', weeks: 'Weeks 3–5', body: '' },
      { phase: 'Deliver', weeks: 'Weeks 6–10', body: '' },
      { phase: 'Develop', weeks: 'Weeks 11+', body: '' },
    ],
  },
  concepts: [
    { name: 'Idea 01', direction: '', image: '' },
    { name: 'Idea 02', direction: '', image: '' },
  ],
  investment: {
    currency: '£',
    note: '',
    tiers: [
      { name: 'Essentials', tag: 'Launch-ready', price: '', cadence: 'project', summary: '', includes: [''], featured: false },
      { name: 'Growth',     tag: 'Recommended',  price: '', cadence: 'project', summary: '', includes: [''], featured: true },
      { name: 'Elite',      tag: 'Full partnership', price: '', cadence: 'project + retainer', summary: '', includes: [''], featured: false },
    ],
  },
  terms: [
    '50% engagement fee on acceptance, balance invoiced at delivery milestones.',
    'Two rounds of feedback included per deliverable; additional time billed at the standard rate of £30/hr.',
    'This proposal is valid for 60 days from the date issued.',
  ],
});

const inputCls =
  'bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 px-0 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]';
const textareaCls =
  'bg-transparent border border-[#2a2a2a] rounded-sm text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]';
const sectionCls = 'border-t border-[#1f1f1f] py-10';
const labelCls = 'font-sub text-[11px] text-[#8a8378]';

const ProposalEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProposal());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [proposalRecord, setProposalRecord] = useState(null);

  // Block search engines
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (isNew) return;
      try {
        const list = await apiListProposals();
        const found = list.find((p) => p.id === id);
        if (!found) {
          toast.error('Proposal not found.');
          navigate('/admin');
          return;
        }
        if (cancelled) return;
        setForm({ ...emptyProposal(), ...found });
        setProposalRecord(found);
        setSlugTouched(true);
      } catch (e) {
        toast.error('Failed to load proposal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, navigate]);

  // Auto-slug from client name (only while creating, before user manually edits slug)
  useEffect(() => {
    if (isNew && !slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.client) }));
    }
  }, [form.client, isNew, slugTouched]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (path, value) =>
    setForm((f) => {
      const next = structuredClone(f);
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });

  const handleSave = async (overrideStatus) => {
    if (!form.client.trim()) {
      toast.error('Client name is required.');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required (auto-fills from client name).');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (overrideStatus) payload.status = overrideStatus;
      if (isNew) {
        const created = await apiCreateProposal(payload);
        toast.success('Proposal created.');
        navigate(`/admin/proposals/${created.id}`, { replace: true });
      } else {
        await apiUpdateProposal(form.id, payload);
        toast.success('Saved.');
        if (overrideStatus) setForm((f) => ({ ...f, status: overrideStatus }));
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCover = async (file) => {
    try {
      const { path } = await apiUploadImage(file);
      set('coverImage', path);
      toast.success('Cover image uploaded.');
    } catch (e) {
      toast.error('Upload failed.');
    }
  };

  const handleUploadConcept = async (index, file) => {
    try {
      const { path } = await apiUploadImage(file);
      const concepts = [...form.concepts];
      concepts[index] = { ...concepts[index], image: path };
      set('concepts', concepts);
      toast.success('Concept image uploaded.');
    } catch (e) {
      toast.error('Upload failed.');
    }
  };

  const liveLink = useMemo(
    () => `${window.location.origin}/proposals/${form.slug}`,
    [form.slug]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading proposal…
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
              {isNew ? 'New proposal' : `Edit — ${form.client}`}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {!isNew && (
              <a
                href={`/proposals/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </a>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Status + Live link strip */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-[#141414] border border-[#2a2a2a] rounded-sm px-5 py-4 mb-10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.status === 'published'}
                onCheckedChange={(checked) =>
                  set('status', checked ? 'published' : 'draft')
                }
              />
              <div>
                <div className="font-sub text-[11px] text-[#f2ece2]">
                  {form.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                </div>
                <div className="text-[11px] text-[#8a8378] font-light">
                  {form.status === 'published'
                    ? 'Anyone with the link can view.'
                    : 'Only viewable via direct link.'}
                </div>
              </div>
            </div>
          </div>
          {form.slug && (
            <a
              href={`/proposals/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-[#a8a195] hover:text-[#e3494e] transition-colors truncate max-w-full"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {liveLink}
            </a>
          )}
        </div>

        {/* === Basics === */}
        <section className="pb-2">
          <h2 className="font-display-xl text-2xl md:text-3xl mb-6">
            Basics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelCls}>Client name *</Label>
              <Input value={form.client} onChange={(e) => set('client', e.target.value)} className={inputCls} placeholder="The Hobby Horse" />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                className={`${inputCls} font-mono`}
                placeholder="hobby-horse"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className={labelCls}>Project title</Label>
              <Input value={form.projectTitle} onChange={(e) => set('projectTitle', e.target.value)} className={inputCls} placeholder="Digital Brand & Web Elevation for The Hobby Horse" />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Reference</Label>
              <Input value={form.reference} onChange={(e) => set('reference', e.target.value)} className={inputCls} placeholder="RM-2025-048" />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Prepared for</Label>
              <Input value={form.preparedFor} onChange={(e) => set('preparedFor', e.target.value)} className={inputCls} placeholder="Harriet Ashworth, Founder" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className={labelCls}>Intro paragraph</Label>
              <Textarea rows={4} value={form.intro} onChange={(e) => set('intro', e.target.value)} className={textareaCls} placeholder="A focused proposal to elevate…" />
            </div>
          </div>
        </section>

        {/* === Cover Image === */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Cover image</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Appears full-bleed behind the proposal title with a dark overlay.
          </p>
          <CoverImagePicker
            value={form.coverImage}
            onChange={(v) => set('coverImage', v)}
            onUpload={handleUploadCover}
          />
        </section>

        {/* === Project Scope === */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-6">Project scope</h2>
          <div className="space-y-2 mb-6">
            <Label className={labelCls}>One-line summary</Label>
            <Input value={form.scope.summary} onChange={(e) => setNested('scope.summary', e.target.value)} className={inputCls} placeholder="Full digital rebrand, bespoke website build, and local SEO strategy." />
          </div>
          <ListEditor
            label="Goals"
            placeholder="Reposition the brand for a wider audience…"
            items={form.scope.goals}
            onChange={(v) => setNested('scope.goals', v)}
          />
          <div className="mt-8" />
          <ListEditor
            label="Deliverables"
            placeholder="Brand audit & reposition strategy"
            items={form.scope.deliverables}
            onChange={(v) => setNested('scope.deliverables', v)}
          />
        </section>

        {/* === Initial Ideas === */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Initial ideas</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Early direction starting points — not committed concepts.
          </p>
          <div className="space-y-6">
            {form.concepts.map((c, i) => (
              <div key={i} className="grid md:grid-cols-[160px_1fr] gap-4 items-start border border-[#2a2a2a] rounded-sm p-4">
                <ImageDrop
                  value={c.image}
                  onUpload={(file) => handleUploadConcept(i, file)}
                  onPaste={(url) => {
                    const arr = [...form.concepts];
                    arr[i] = { ...arr[i], image: url };
                    set('concepts', arr);
                  }}
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Input
                      value={c.name}
                      onChange={(e) => {
                        const arr = [...form.concepts];
                        arr[i] = { ...arr[i], name: e.target.value };
                        set('concepts', arr);
                      }}
                      className={inputCls}
                      placeholder="Idea 01 — The Stable"
                    />
                    <button
                      type="button"
                      onClick={() => set('concepts', form.concepts.filter((_, idx) => idx !== i))}
                      className="text-[#8a8378] hover:text-[#e3494e] p-2"
                      title="Remove idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Textarea
                    rows={3}
                    value={c.direction}
                    onChange={(e) => {
                      const arr = [...form.concepts];
                      arr[i] = { ...arr[i], direction: e.target.value };
                      set('concepts', arr);
                    }}
                    className={textareaCls}
                    placeholder="Warm, candle-lit, confidently local…"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                set('concepts', [
                  ...form.concepts,
                  { name: `Idea 0${form.concepts.length + 1}`, direction: '', image: '' },
                ])
              }
              className="inline-flex items-center gap-2 border border-dashed border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#a8a195] rounded-sm px-4 py-2.5 font-sub text-[11px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another idea
            </button>
          </div>
        </section>

        {/* === Investment === */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-2">Investment tiers</h2>
          <p className="text-[13px] text-[#8a8378] font-light mb-6">
            Three pricing options. Toggle one as recommended.
          </p>
          <div className="space-y-2 mb-6">
            <Label className={labelCls}>Pricing note</Label>
            <Textarea rows={2} value={form.investment.note} onChange={(e) => setNested('investment.note', e.target.value)} className={textareaCls} />
          </div>
          <div className="space-y-4">
            {form.investment.tiers.map((t, i) => (
              <div key={i} className="border border-[#2a2a2a] rounded-sm p-5">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className={labelCls}>Tier name</Label>
                    <Input
                      value={t.name}
                      onChange={(e) => {
                        const tiers = [...form.investment.tiers];
                        tiers[i] = { ...tiers[i], name: e.target.value };
                        setNested('investment.tiers', tiers);
                      }}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelCls}>Tag</Label>
                    <Input
                      value={t.tag}
                      onChange={(e) => {
                        const tiers = [...form.investment.tiers];
                        tiers[i] = { ...tiers[i], tag: e.target.value };
                        setNested('investment.tiers', tiers);
                      }}
                      className={inputCls}
                      placeholder="Recommended"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelCls}>Price ({form.investment.currency})</Label>
                    <Input
                      value={t.price}
                      onChange={(e) => {
                        const tiers = [...form.investment.tiers];
                        tiers[i] = { ...tiers[i], price: e.target.value };
                        setNested('investment.tiers', tiers);
                      }}
                      className={inputCls}
                      placeholder="12,400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelCls}>Cadence</Label>
                    <Input
                      value={t.cadence}
                      onChange={(e) => {
                        const tiers = [...form.investment.tiers];
                        tiers[i] = { ...tiers[i], cadence: e.target.value };
                        setNested('investment.tiers', tiers);
                      }}
                      className={inputCls}
                      placeholder="project"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label className={labelCls}>Summary line</Label>
                  <Textarea
                    rows={2}
                    value={t.summary}
                    onChange={(e) => {
                      const tiers = [...form.investment.tiers];
                      tiers[i] = { ...tiers[i], summary: e.target.value };
                      setNested('investment.tiers', tiers);
                    }}
                    className={textareaCls}
                  />
                </div>
                <ListEditor
                  label="What's included"
                  placeholder="Brand audit & one identity direction"
                  items={t.includes}
                  onChange={(items) => {
                    const tiers = [...form.investment.tiers];
                    tiers[i] = { ...tiers[i], includes: items };
                    setNested('investment.tiers', tiers);
                  }}
                />
                <label className="mt-4 inline-flex items-center gap-3 cursor-pointer">
                  <Switch
                    checked={!!t.featured}
                    onCheckedChange={(checked) => {
                      const tiers = form.investment.tiers.map((tier, idx) =>
                        idx === i ? { ...tier, featured: checked } : { ...tier, featured: checked ? false : tier.featured }
                      );
                      setNested('investment.tiers', tiers);
                    }}
                  />
                  <span className="font-sub text-[11px] text-[#a8a195]">
                    Mark as recommended
                  </span>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* === Terms === */}
        <section className={sectionCls}>
          <h2 className="font-display-xl text-2xl md:text-3xl mb-6">Terms</h2>
          <ListEditor
            label="Terms"
            placeholder="50% engagement fee on acceptance…"
            items={form.terms}
            onChange={(v) => set('terms', v)}
            multiline
          />
        </section>

        {/* Footer actions */}
        <div className="mt-12 flex items-center justify-between gap-3 flex-wrap pt-8 border-t border-[#1f1f1f]">
          <Link to="/admin" className="font-sub text-[11px] text-[#8a8378] hover:text-[#e3494e] transition-colors">
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-12 px-5 font-sub text-[11px] transition-colors"
            >
              Save as draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 px-6 font-sub text-[11px] transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save & publish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ----- helpers ----- */
const ListEditor = ({ label, placeholder, items, onChange, multiline = false }) => {
  const update = (i, v) => {
    const arr = [...items];
    arr[i] = v;
    onChange(arr);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);
  return (
    <div>
      <Label className="font-sub text-[11px] text-[#8a8378] block mb-3">{label}</Label>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-3 w-1.5 h-1.5 rounded-full bg-[#e3494e] shrink-0" />
            {multiline ? (
              <Textarea
                rows={2}
                value={item}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className={textareaCls + ' flex-1'}
              />
            ) : (
              <Input
                value={item}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className={inputCls + ' flex-1'}
              />
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[#8a8378] hover:text-[#e3494e] p-2"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-2 font-sub text-[11px] text-[#a8a195] hover:text-[#e3494e] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add
      </button>
    </div>
  );
};

const CoverImagePicker = ({ value, onChange, onUpload }) => {
  const fileRef = React.useRef();
  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-5 items-start">
      <div className="aspect-[4/3] bg-[#0f0f0f] border border-[#2a2a2a] rounded-sm overflow-hidden flex items-center justify-center">
        {value ? (
          <img src={resolveAsset(value)} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-8 h-8 text-[#3a3a3a]" />
        )}
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#f2ece2] rounded-full h-10 px-4 font-sub text-[10px] transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-2 font-sub text-[10px] text-[#8a8378] hover:text-[#e3494e]"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>
        <div className="space-y-2">
          <Label className="font-sub text-[11px] text-[#8a8378]">Or paste an image URL</Label>
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or /api/uploads/abc.jpg"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
};

const ImageDrop = ({ value, onUpload, onPaste }) => {
  const fileRef = React.useRef();
  return (
    <div className="space-y-2">
      <div className="aspect-square bg-[#0f0f0f] border border-[#2a2a2a] rounded-sm overflow-hidden flex items-center justify-center">
        {value ? (
          <img src={resolveAsset(value)} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-[#3a3a3a]" />
        )}
      </div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full inline-flex items-center justify-center gap-1.5 border border-[#2a2a2a] hover:border-[#e3494e] hover:text-[#e3494e] text-[#a8a195] rounded-sm h-8 font-sub text-[9px] transition-colors"
      >
        <Upload className="w-3 h-3" />
        Upload
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <Input
        value={value || ''}
        onChange={(e) => onPaste(e.target.value)}
        placeholder="or URL"
        className={`${inputCls} text-[11px] h-8`}
      />
    </div>
  );
};

export default ProposalEditor;
