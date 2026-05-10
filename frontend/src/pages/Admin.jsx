import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  LogOut,
  Eye,
  Loader2,
  Bell,
  CheckCircle2,
  HelpCircle,
  XOctagon,
  Inbox,
  Mail,
  LayoutGrid,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  apiListProposals,
  apiDeleteProposal,
  apiListActions,
  apiMarkActionRead,
} from '../lib/api';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';

const statusColours = {
  draft: 'bg-[#2a2a2a] text-[#d8d2c6] border-[#2a2a2a]',
  published: 'bg-[#1f3f2a] text-[#9cd3af] border-[#2b5a3a]',
};

const actionIcons = {
  approve: <CheckCircle2 className="w-4 h-4 text-[#9cd3af]" />,
  revision: <HelpCircle className="w-4 h-4 text-[#e3494e]" />,
  decline: <XOctagon className="w-4 h-4 text-[#8a8378]" />,
};

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('proposals'); // 'proposals' | 'inbox'
  const [proposals, setProposals] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([apiListProposals(), apiListActions()]);
      setProposals(p);
      setActions(a);
    } catch (e) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const unreadCount = useMemo(
    () => actions.filter((a) => !a.read).length,
    [actions]
  );

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      await apiDeleteProposal(confirmDel.id);
      toast.success(`Deleted “${confirmDel.client}”.`);
      setConfirmDel(null);
      loadAll();
    } catch (e) {
      toast.error('Could not delete the proposal.');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const onMarkRead = async (id) => {
    try {
      await apiMarkActionRead(id);
      setActions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, read: true } : a))
      );
    } catch {
      toast.error('Could not mark as read.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png"
              alt=""
              className="h-7 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-[#2a2a2a]" />
            <span className="font-sub text-[10px] text-[#8a8378]">Admin Dashboard</span>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 font-sub text-[10px] text-[#8a8378] hover:text-[#e3494e] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Heading + new */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-3">
              § Studio Control Room
            </div>
            <h1 className="font-display-xl text-4xl md:text-5xl">
              Welcome <span className="text-[#e3494e]">back.</span>
            </h1>
          </div>
          <Link
            to="/admin/proposals/new"
            className="inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 px-5 font-sub text-[11px] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New proposal
          </Link>
        </div>

        {/* Quick-access cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link
            to="/admin/site-content"
            className="group bg-[#141414] border border-[#2a2a2a] hover:border-[#e3494e] rounded-sm p-6 transition-colors flex items-start gap-4"
          >
            <span className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#2a2a2a] group-hover:bg-[#e3494e] group-hover:border-[#e3494e] inline-flex items-center justify-center text-[#a8a195] group-hover:text-white transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-display uppercase tracking-wider text-sm text-[#f2ece2] font-bold">
                  Site Content
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#8a8378] group-hover:text-[#e3494e] transition-colors" />
              </div>
              <p className="text-[13px] text-[#a8a195] font-light mt-1">
                Edit the homepage — hero, about, services, 4D framework and contact info.
              </p>
            </div>
          </Link>
          <Link
            to="/admin/proposals/new"
            className="group bg-[#141414] border border-[#2a2a2a] hover:border-[#e3494e] rounded-sm p-6 transition-colors flex items-start gap-4"
          >
            <span className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#2a2a2a] group-hover:bg-[#e3494e] group-hover:border-[#e3494e] inline-flex items-center justify-center text-[#a8a195] group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-display uppercase tracking-wider text-sm text-[#f2ece2] font-bold">
                  New Proposal
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#8a8378] group-hover:text-[#e3494e] transition-colors" />
              </div>
              <p className="text-[13px] text-[#a8a195] font-light mt-1">
                Create a private, gold-standard client proposal page in a few minutes.
              </p>
            </div>
          </Link>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-2 mb-8 border-b border-[#1f1f1f]">
          <button
            onClick={() => setTab('proposals')}
            className={`relative inline-flex items-center gap-2 px-4 py-3 font-sub text-[11px] transition-colors ${
              tab === 'proposals' ? 'text-[#f2ece2]' : 'text-[#8a8378] hover:text-[#f2ece2]'
            }`}
          >
            Proposals ({proposals.length})
            {tab === 'proposals' && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#e3494e]" />
            )}
          </button>
          <button
            onClick={() => setTab('inbox')}
            className={`relative inline-flex items-center gap-2 px-4 py-3 font-sub text-[11px] transition-colors ${
              tab === 'inbox' ? 'text-[#f2ece2]' : 'text-[#8a8378] hover:text-[#f2ece2]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Inbox ({actions.length})
            {unreadCount > 0 && (
              <span className="bg-[#e3494e] text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
            {tab === 'inbox' && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#e3494e]" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center text-[#8a8378] font-mono text-[11px] uppercase tracking-[0.22em]">
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
          </div>
        ) : tab === 'proposals' ? (
          <ProposalsTable
            proposals={proposals}
            onDelete={(p) => setConfirmDel(p)}
          />
        ) : (
          <InboxList actions={actions} onMarkRead={onMarkRead} />
        )}
      </main>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent className="bg-[#141414] border-[#2a2a2a] text-[#f2ece2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase tracking-tight">
              Delete proposal?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#a8a195]">
              This will permanently remove “{confirmDel?.client}” ({confirmDel?.slug}). This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#2a2a2a] text-[#f2ece2] hover:bg-[#1a1a1a]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#e3494e] hover:bg-[#c93b3f]"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ProposalsTable = ({ proposals, onDelete }) => {
  if (proposals.length === 0) {
    return (
      <div className="border border-dashed border-[#2a2a2a] rounded-sm p-12 text-center">
        <Inbox className="w-8 h-8 text-[#3a3a3a] mx-auto mb-4" />
        <h3 className="font-display uppercase tracking-tight text-xl text-[#f2ece2] font-bold mb-2">
          No proposals yet
        </h3>
        <p className="text-[14px] text-[#8a8378] font-light max-w-md mx-auto">
          Start with “New proposal” above. Drafts are private; publish a proposal to share its
          link with a client.
        </p>
      </div>
    );
  }
  return (
    <div className="border border-[#1f1f1f] rounded-sm overflow-hidden bg-[#0f0f0f]">
      <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#1f1f1f] font-sub text-[10px] text-[#8a8378]">
        <span>Client</span>
        <span>Slug</span>
        <span>Status</span>
        <span>Updated</span>
        <span className="text-right pr-2">Actions</span>
      </div>
      {proposals.map((p) => (
        <div
          key={p.id}
          className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 border-b border-[#1f1f1f] last:border-b-0 hover:bg-[#141414] transition-colors items-center"
        >
          <div className="min-w-0">
            <div className="font-display uppercase tracking-tight text-base text-[#f2ece2] font-bold truncate">
              {p.client || 'Untitled'}
            </div>
            <div className="text-[12px] text-[#8a8378] font-light truncate">
              {p.projectTitle || '—'}
            </div>
          </div>
          <code className="font-mono text-[12px] text-[#a8a195] truncate">/{p.slug}</code>
          <div>
            <Badge
              className={`font-sub text-[9px] border ${
                statusColours[p.status] || statusColours.draft
              }`}
            >
              {(p.status || 'draft').toUpperCase()}
            </Badge>
          </div>
          <div className="font-mono text-[11px] text-[#8a8378]">
            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <a
              href={`/proposals/${p.slug}`}
              target="_blank"
              rel="noreferrer"
              title={p.status === 'published' ? 'Open live link' : 'Preview draft'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#2a2a2a] text-[#a8a195] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
            >
              {p.status === 'published' ? (
                <ExternalLink className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </a>
            <Link
              to={`/admin/proposals/${p.id}`}
              title="Edit"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#2a2a2a] text-[#a8a195] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => onDelete(p)}
              title="Delete"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#2a2a2a] text-[#a8a195] hover:text-[#e3494e] hover:border-[#e3494e] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const InboxList = ({ actions, onMarkRead }) => {
  if (actions.length === 0) {
    return (
      <div className="border border-dashed border-[#2a2a2a] rounded-sm p-12 text-center">
        <Mail className="w-8 h-8 text-[#3a3a3a] mx-auto mb-4" />
        <h3 className="font-display uppercase tracking-tight text-xl text-[#f2ece2] font-bold mb-2">
          Inbox is quiet
        </h3>
        <p className="text-[14px] text-[#8a8378] font-light">
          Client decisions on proposals will appear here.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {actions.map((a) => (
        <li
          key={a.id}
          className={`border rounded-sm p-5 transition-colors ${
            a.read
              ? 'border-[#1f1f1f] bg-[#0f0f0f]'
              : 'border-[#e3494e]/40 bg-[#141414]'
          }`}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 min-w-0">
              <span className="mt-0.5">{actionIcons[a.action]}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sub text-[11px] text-[#f2ece2]">
                    {a.action.toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px] text-[#8a8378]">·</span>
                  <span className="font-display uppercase tracking-tight text-sm text-[#f2ece2] font-bold">
                    {a.client}
                  </span>
                  {a.tier && (
                    <span className="font-sub text-[10px] text-[#e3494e]">· {a.tier.toUpperCase()}</span>
                  )}
                </div>
                <code className="font-mono text-[11px] text-[#8a8378]">/{a.slug}</code>
                {a.payload?.name && (
                  <p className="mt-2 text-[13px] text-[#d8d2c6] font-light">
                    — {a.payload.name}
                  </p>
                )}
                {a.payload?.question && (
                  <p className="mt-2 text-[14px] text-[#d8d2c6] font-light leading-relaxed">
                    “{a.payload.question}”
                  </p>
                )}
                {a.payload?.feedback && (
                  <p className="mt-2 text-[14px] text-[#d8d2c6] font-light leading-relaxed">
                    “{a.payload.feedback}”
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-[11px] text-[#8a8378] whitespace-nowrap">
                {new Date(a.actedAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {!a.read && (
                <button
                  onClick={() => onMarkRead(a.id)}
                  className="font-sub text-[10px] text-[#e3494e] hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Admin;
