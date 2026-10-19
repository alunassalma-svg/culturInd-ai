import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import {
  Shield, LogOut, Check, X, AlertTriangle, Edit, TrendingUp,
  Users, Flag, BarChart3, Clock, ChevronRight,
} from 'lucide-react';

// Sample flagged posts for the demo
const sampleQueue = [
  { id: 'q1', author: 'BatikLover22', mode: 'Explorer', content: 'Check out my new batik design! Made it with the Batik Designer tool.', reason: 'Pending approval (Explorer post)', status: 'pending', time: '2m ago' },
  { id: 'q2', author: 'DanceFan', mode: 'Explorer', content: 'I love Tari Saman so much! The hand movements are amazing.', reason: 'Pending approval (Explorer post)', status: 'pending', time: '5m ago' },
  { id: 'q3', author: 'StreetStyleID', mode: 'Creator', content: 'Made a hoodie with kawung motifs. Culture x Global!', reason: 'AI flagged: possible off-topic', status: 'flagged', time: '10m ago' },
  { id: 'q4', author: 'Newbie123', mode: 'Creator', content: 'Hey everyone, my phone number is 08123456789, text me!', reason: 'AI blocked: personal information', status: 'blocked', time: '15m ago' },
  { id: 'q5', author: 'LegendLover', mode: 'Creator', content: 'Malin Kundang is from West Sumatra, but my grandma says in her version...', reason: 'Reported by user: "incorrect info"', reason2: '', status: 'reported', time: '20m ago' },
];

const sampleReports = [
  { id: 'r1', reporter: 'CultureKid', target: 'LegendLover', reason: 'Incorrect information about Malin Kundang', status: 'new', time: '20m ago' },
  { id: 'r2', reporter: 'BatikDreamer', target: 'Newbie123', reason: 'Sharing personal information', status: 'in review', time: '15m ago' },
  { id: 'r3', reporter: 'DanceStar', target: 'TrollUser', reason: 'Off-topic spam post', status: 'resolved', time: '1h ago' },
];

const sampleUsers = [
  { nickname: 'Newbie123', warnings: 1, cooldown: 'None', mode: 'Creator' },
  { nickname: 'TrollUser', warnings: 2, cooldown: '24h', mode: 'Creator' },
  { nickname: 'BatikLover22', warnings: 0, cooldown: 'None', mode: 'Explorer' },
];

const aiBlockedCounts = [
  { category: 'Personal Information', count: 12, falsePos: 1 },
  { category: 'Off-topic Posts', count: 8, falsePos: 2 },
  { category: 'Profanity (ID)', count: 5, falsePos: 0 },
  { category: 'Spam', count: 15, falsePos: 3 },
  { category: 'Photos with People', count: 3, falsePos: 0 },
];

const auditLog = [
  { mod: 'admin', action: 'Approved post by BatikLover22', time: '1h ago' },
  { mod: 'moderator1', action: 'Rejected post (personal info) by Newbie123', time: '2h ago' },
  { mod: 'admin', action: 'Lifted strike on BatikDreamer', time: '3h ago' },
  { mod: 'moderator1', action: 'Restored false positive from AI Safety', time: '5h ago' },
];

type Tab = 'queue' | 'reports' | 'users' | 'aisafety' | 'stats';

export function ModeratorPage() {
  const { language, impactCounts, setPage } = useApp();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator'>('moderator');
  const [tab, setTab] = useState<Tab>('queue');
  const [queue, setQueue] = useState(sampleQueue);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > 5 * 60 * 1000) {
        handleLogout();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [loggedIn, lastActivity]);

  const updateActivity = () => setLastActivity(Date.now());

  const handleLogin = () => {
    // Demo login: demo-moderator / demo-password
    if (email === 'demo-moderator' && password === 'demo-password') {
      setLoggedIn(true);
      setRole('moderator');
      setLoginError('');
    } else if (email === 'demo-admin' && password === 'demo-password') {
      setLoggedIn(true);
      setRole('admin');
      setLoginError('');
    } else {
      setLoginError(language === 'EN' ? 'Invalid credentials. Use demo-moderator / demo-password' : 'Kredensial tidak valid. Gunakan demo-moderator / demo-password');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    setPage('home');
  };

  const handleAction = (id: string, action: 'approve' | 'reject' | 'edit' | 'escalate' | 'remove') => {
    setQueue(queue.map((item) =>
      item.id === id ? { ...item, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'remove' ? 'removed' : item.status } : item
    ));
    updateActivity();
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-ink-800 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-neon-pink" size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Moderator Dashboard</h1>
            <p className="text-sm text-ink-400 mt-1">Staff only — private area</p>
          </div>

          {/* Prototype only notice */}
          <div className="mb-4 p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg">
            <p className="text-xs text-neon-yellow">
              ⚠️ Prototype only — real launch needs server-side authentication with two-step verification.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-ink-300 mb-1 block">Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo-moderator"
                className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-white outline-none focus:border-neon-pink"
              />
            </div>
            <div>
              <label className="text-sm text-ink-300 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="demo-password"
                className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-white outline-none focus:border-neon-pink"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <Button variant="neon-pink" className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <div className="text-xs text-ink-500 text-center space-y-1">
              <p>Demo credentials:</p>
              <p>Moderator: <span className="text-neon-blue">demo-moderator / demo-password</span></p>
              <p>Admin: <span className="text-neon-blue">demo-admin / demo-password</span></p>
            </div>
          </div>

          <button
            onClick={() => setPage('home')}
            className="mt-4 text-sm text-ink-500 hover:text-white w-full text-center"
          >
            ← Back to CulturInd.ai
          </button>
        </Card>
      </div>
    );
  }

  // Dashboard
  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: 'queue', label: 'Review Queue', icon: Clock },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'aisafety', label: 'AI Safety', icon: Shield },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  const pendingCount = queue.filter((q) => q.status === 'pending' || q.status === 'flagged' || q.status === 'reported').length;

  return (
    <div className="min-h-screen bg-ink-900 batik-bg-light" onClick={updateActivity}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-ink-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-neon-pink" size={24} />
          <div>
            <h1 className="text-lg font-display font-bold text-white">Moderator Dashboard</h1>
            <p className="text-xs text-ink-500">Logged in as: {role} · {role === 'admin' ? 'Full access' : 'Review only'}</p>
          </div>
        </div>
        <Button size="sm" variant="danger" onClick={handleLogout}>
          <LogOut size={14} /> Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.id}
                onClick={() => { setTab(tabItem.id); updateActivity(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === tabItem.id
                    ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/40'
                    : 'bg-ink-800 text-ink-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tabItem.label}
                {tabItem.id === 'queue' && pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-neon-pink text-white text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Queue tab */}
        {tab === 'queue' && (
          <div className="space-y-3">
            {queue.filter((q) => q.status !== 'approved' && q.status !== 'rejected' && q.status !== 'removed').map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white">{item.author}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-ink-700 text-ink-400">{item.mode}</span>
                      <span className="text-xs text-ink-500">{item.time}</span>
                    </div>
                    <p className="text-sm text-ink-200 mb-2">{item.content}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'flagged' ? 'bg-neon-yellow/20 text-neon-yellow' :
                        item.status === 'reported' ? 'bg-neon-pink/20 text-neon-pink' :
                        'bg-neon-blue/20 text-neon-blue'
                      }`}>
                        {item.reason}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => handleAction(item.id, 'approve')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-green/20 text-neon-green text-xs hover:bg-neon-green/30">
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => handleAction(item.id, 'reject')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30">
                      <X size={12} /> Reject
                    </button>
                    <button onClick={() => handleAction(item.id, 'edit')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-blue/20 text-neon-blue text-xs hover:bg-neon-blue/30">
                      <Edit size={12} /> Edit PII
                    </button>
                    {role === 'admin' && (
                      <button onClick={() => handleAction(item.id, 'escalate')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-yellow/20 text-neon-yellow text-xs hover:bg-neon-yellow/30">
                        <AlertTriangle size={12} /> Escalate
                      </button>
                    )}
                    <button onClick={() => handleAction(item.id, 'remove')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-ink-700 text-ink-400 text-xs hover:bg-ink-600">
                      <X size={12} /> Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            {queue.filter((q) => q.status !== 'approved' && q.status !== 'rejected' && q.status !== 'removed').length === 0 && (
              <Card className="text-center py-12">
                <Check className="text-neon-green mx-auto mb-3" size={48} />
                <p className="text-ink-300">Queue is empty! All caught up. 🎉</p>
              </Card>
            )}
          </div>
        )}

        {/* Reports tab */}
        {tab === 'reports' && (
          <div className="space-y-3">
            {sampleReports.map((report) => (
              <Card key={report.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white"><span className="font-bold">{report.reporter}</span> reported <span className="font-bold">{report.target}</span></p>
                    <p className="text-sm text-ink-300 mt-1">{report.reason}</p>
                    <p className="text-xs text-ink-500 mt-1">{report.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    report.status === 'new' ? 'bg-neon-pink/20 text-neon-pink' :
                    report.status === 'in review' ? 'bg-neon-yellow/20 text-neon-yellow' :
                    'bg-neon-green/20 text-neon-green'
                  }`}>{report.status}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-3">
            {sampleUsers.map((user) => (
              <Card key={user.nickname}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{user.nickname}</p>
                    <p className="text-xs text-ink-500">Mode: {user.mode} · Warnings: {user.warnings} · Cooldown: {user.cooldown}</p>
                  </div>
                  {user.warnings > 0 && (
                    <Button size="sm" variant="ghost" onClick={updateActivity}>
                      Lift strike
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* AI Safety tab */}
        {tab === 'aisafety' && (
          <div className="space-y-3">
            <Card>
              <h3 className="font-display font-bold text-white mb-3">AI Screening — Blocked Content by Category</h3>
              <div className="space-y-2">
                {aiBlockedCounts.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-ink-800 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{item.category}</p>
                      <p className="text-xs text-ink-500">{item.count} blocked · {item.falsePos} false positives</p>
                    </div>
                    {item.falsePos > 0 && (
                      <Button size="sm" variant="neon-blue">
                        Restore false positive
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <div className="text-3xl font-display font-black text-neon-pink">{pendingCount}</div>
                <p className="text-sm text-ink-400 mt-1">Pending Items</p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-display font-black text-neon-blue">~2m</div>
                <p className="text-sm text-ink-400 mt-1">Avg Review Time</p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-display font-black text-neon-green">98%</div>
                <p className="text-sm text-ink-400 mt-1">Approval Rate</p>
              </Card>
            </div>

            <Card>
              <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-neon-green" /> Impact Counter (Anonymous)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-blue">{impactCounts.familyConversations.toLocaleString()}</div>
                  <p className="text-xs text-ink-500">Family Conversations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-pink">{impactCounts.legendsExplored.toLocaleString()}</div>
                  <p className="text-xs text-ink-500">Legends Explored</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{impactCounts.danceStepsPracticed.toLocaleString()}</div>
                  <p className="text-xs text-ink-500">Dance Steps</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-display font-bold text-white mb-3">Audit Log</h3>
              <div className="space-y-2">
                {auditLog.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-300 p-2 bg-ink-800 rounded-lg">
                    <span className="text-xs font-mono text-neon-pink">{entry.mod}</span>
                    <span>{entry.action}</span>
                    <span className="ml-auto text-xs text-ink-500">{entry.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
