import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Modal, Button } from '@/components/ui';
import { content } from '@/data/content';
import { t } from '@/data/content';
import { Sparkles, Flame, Award, Edit3, Check, LogOut, Mail, ShieldCheck } from 'lucide-react';

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, setProfile, language, isCreator } = useApp();
  const { user, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.nickname);
  const [tempColor, setTempColor] = useState(profile.avatarColor);
  const [tempPattern, setTempPattern] = useState(profile.avatarPattern);
  const [signingOut, setSigningOut] = useState(false);

  const handleSave = () => {
    setProfile({
      nickname: tempName || 'Explorer',
      avatarColor: tempColor,
      avatarPattern: tempPattern,
    });
    setEditing(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    onClose();
  };

  const earnedBadges = content.badges.filter((b) => profile.badges.includes(b.id));
  const lockedBadges = content.badges.filter((b) => !profile.badges.includes(b.id));

  return (
    <Modal open={open} onClose={onClose} title="Profile & Badges" maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Account info */}
        {user && (
          <div className="flex items-center gap-3 p-3 bg-ink-800 rounded-xl border border-ink-700">
            <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-neon-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink-400">Signed in as</p>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
            </div>
            <ShieldCheck size={18} className="text-neon-green flex-shrink-0" />
          </div>
        )}

        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-black text-white relative overflow-hidden"
            style={{ backgroundColor: tempColor }}
          >
            {profile.nickname.charAt(0).toUpperCase()}
            <div className="absolute inset-0 batik-bg-light opacity-40" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-display font-bold text-white">{profile.nickname}</p>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <span className="flex items-center gap-1 text-neon-yellow">
                <Sparkles size={14} /> {profile.points} pts
              </span>
              <span className="flex items-center gap-1 text-neon-pink">
                <Flame size={14} /> {profile.streak} day streak
              </span>
            </div>
          </div>
          {!editing && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Edit3 size={16} /> Edit
            </Button>
          )}
        </div>

        {/* Avatar editor */}
        {editing && (
          <div className="space-y-4 p-4 bg-ink-800 rounded-xl">
            <div>
              <label className="text-sm text-ink-300 mb-2 block">Nickname</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value.slice(0, 20))}
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-blue"
                placeholder="Your nickname"
              />
              <p className="text-xs text-ink-500 mt-1">No real names please — stay safe!</p>
            </div>
            <div>
              <label className="text-sm text-ink-300 mb-2 block">Avatar Color</label>
              <div className="flex flex-wrap gap-2">
                {content.avatarColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTempColor(color)}
                    className={`w-8 h-8 rounded-lg ${tempColor === color ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-ink-300 mb-2 block">Avatar Pattern</label>
              <div className="flex flex-wrap gap-2">
                {content.avatarPatterns.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => setTempPattern(pattern)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      tempPattern === pattern
                        ? 'bg-batik-400 text-white'
                        : 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {pattern.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-500 mt-1">Illustrated avatars only — no real photos!</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Check size={16} /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Badges */}
        <div>
          <h3 className="text-sm font-bold text-batik-400 mb-3 flex items-center gap-2">
            <Award size={16} /> Badges ({earnedBadges.length}/{content.badges.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-ink-800 rounded-xl border border-neon-yellow/30">
                <span className="text-3xl mb-1">{badge.emoji}</span>
                <span className="text-xs font-medium text-white">{t(badge.name, language)}</span>
              </div>
            ))}
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-ink-800/50 rounded-xl border border-ink-700 opacity-40">
                <span className="text-3xl mb-1 grayscale">{badge.emoji}</span>
                <span className="text-xs font-medium text-ink-400">{t(badge.name, language)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top posts placeholder */}
        {isCreator && (
          <div>
            <h3 className="text-sm font-bold text-batik-400 mb-3">Top Posts</h3>
            <div className="space-y-2">
              <div className="p-3 bg-ink-800 rounded-lg text-sm text-ink-300">
                No posts yet — start creating in Community!
              </div>
            </div>
          </div>
        )}

        {/* Sign out */}
        <div className="pt-2 border-t border-ink-700">
          <Button
            variant="danger"
            size="md"
            className="w-full"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut size={18} /> {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
