/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Shield, Bell, Cloud, Trash2, Smartphone, HardDrive, FileImage, Palette, User, Star, Globe, Lock, X, Check } from 'lucide-react';
import { useState } from 'react';

import { ThemeType } from '../types';

interface SettingsViewProps {
  onClose: () => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export default function SettingsView({ onClose, theme, onThemeChange }: SettingsViewProps) {
  const [permissions, setPermissions] = useState({
    storage: true,
    media: true,
    location: false,
    notifications: true,
  });

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingStep, setRatingStep] = useState<'stars' | 'thanks'>('stars');
  const [selectedStars, setSelectedStars] = useState(0);
  const [language, setLanguage] = useState('English');

  const SettingRow = ({ icon: Icon, label, value, type = 'toggle', onClick }: any) => (
    <div 
      className="flex items-center justify-between p-4 bg-ios-bg active:bg-ios-secondary-bg transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-ios-secondary-bg rounded-lg">
          <Icon size={20} className="text-ios-blue" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {type === 'toggle' ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`w-12 h-7 rounded-full transition-colors relative ${value ? 'bg-green-500' : 'bg-ios-separator'}`}
        >
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      ) : (
        <div className="flex items-center gap-1 text-ios-secondary-label">
          <span className="text-sm">{value}</span>
          <ChevronLeft className="rotate-180 opacity-50" size={16} />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[150] bg-ios-secondary-bg flex flex-col"
    >
      <div className="h-16 flex items-center px-4 bg-ios-bg border-b border-ios-separator pt-4 relative">
        <button onClick={onClose} className="text-ios-blue flex items-center font-medium absolute left-4">
          <ChevronLeft size={24} />
          Back
        </button>
        <h1 className="w-full text-center font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-ios-blue/10 rounded-full flex items-center justify-center text-ios-blue mb-3 shadow-sm">
                <User size={40} />
            </div>
            <h2 className="text-xl font-bold">Lumina Gallery Account</h2>
            <p className="text-ios-secondary-label text-sm tracking-wide">Syncing to iCloud</p>
        </div>

        <section>
          <h3 className="text-[10px] uppercase font-bold text-ios-secondary-label px-4 mb-2 tracking-widest">Library Display</h3>
          <div className="divide-y divide-ios-separator rounded-xl overflow-hidden border border-ios-separator">
            <SettingRow 
              icon={Palette} 
              label="App Theme" 
              value={theme} 
              type="value" 
              onClick={() => setShowThemePicker(true)}
            />
            <SettingRow 
              icon={Globe} 
              label="App Language" 
              value={language} 
              type="value" 
              onClick={() => setShowLangPicker(true)}
            />
            <SettingRow icon={Cloud} label="iCloud Photos" value="On" type="value" />
            <SettingRow icon={Bell} label="Shared Album Notifications" value={permissions.notifications} onClick={() => setPermissions(p => ({ ...p, notifications: !p.notifications }))} />
          </div>
        </section>

        <section>
          <h3 className="text-[10px] uppercase font-bold text-ios-secondary-label px-4 mb-2 tracking-widest">Permissions & Access</h3>
          <div className="divide-y divide-ios-separator rounded-xl overflow-hidden border border-ios-separator">
            <SettingRow 
              icon={HardDrive} 
              label="Files and Media Access" 
              value={permissions.media} 
              onClick={() => setPermissions(p => ({ ...p, media: !p.media }))}
            />
            <SettingRow 
              icon={Smartphone} 
              label="Storage Permission" 
              value={permissions.storage} 
              onClick={() => setPermissions(p => ({ ...p, storage: !p.storage }))}
            />
            <SettingRow 
              icon={Shield} 
              label="Location Services" 
              value={permissions.location} 
              onClick={() => setPermissions(p => ({ ...p, location: !p.location }))}
            />
          </div>
        </section>

        <section>
          <h3 className="text-[10px] uppercase font-bold text-ios-secondary-label px-4 mb-2 tracking-widest">About</h3>
          <div className="divide-y divide-ios-separator rounded-xl overflow-hidden border border-ios-separator">
            <SettingRow 
              icon={Lock} 
              label="Privacy Policy" 
              value="" 
              type="value" 
              onClick={() => setShowPrivacy(true)}
            />
            <button 
              onClick={() => { setShowRating(true); setRatingStep('stars'); setSelectedStars(0); }}
              className="w-full p-4 bg-ios-bg active:bg-ios-secondary-bg transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ios-secondary-bg rounded-lg">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-sm font-medium">Rate the App</span>
              </div>
              <ChevronLeft className="rotate-180 opacity-50" size={16} />
            </button>
          </div>
        </section>

        <section>
          <div className="divide-y divide-ios-separator rounded-xl overflow-hidden border border-ios-separator">
            <button className="w-full p-4 bg-ios-bg text-ios-red text-sm font-semibold text-left flex items-center gap-3 active:bg-ios-secondary-bg transition">
                <Trash2 size={20} />
                Reset Library Cache
            </button>
          </div>
        </section>

        <div className="text-center py-8">
            <p className="text-[10px] text-ios-secondary-label font-bold uppercase tracking-widest">Lumina Gallery v1.4.2</p>
            <p className="text-[10px] text-ios-secondary-label">Designed for Android & Web</p>
        </div>
      </div>

      {/* Theme Picker Modal */}
      <AnimatePresence>
        {showThemePicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowThemePicker(false)}
              className="absolute inset-0 bg-black/40 z-[160] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-3xl z-[170] p-6 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1 bg-ios-separator rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Select Application Theme</h3>
              <div className="space-y-3">
                {(['Light', 'Dark', 'System'] as ThemeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { onThemeChange(t); setShowThemePicker(false); }}
                    className={`w-full p-5 rounded-2xl flex items-center justify-between text-lg font-bold transition-all ${theme === t ? 'bg-ios-blue text-white shadow-lg scale-[1.02]' : 'bg-ios-secondary-bg hover:bg-ios-separator'}`}
                  >
                    <span>{t === 'System' ? 'Follow System' : t}</span>
                    {theme === t && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-ios-blue rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Language Picker Modal */}
      <AnimatePresence>
        {showLangPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLangPicker(false)}
              className="absolute inset-0 bg-black/40 z-[160] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-3xl z-[170] p-6 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1 bg-ios-separator rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Select Language</h3>
              <div className="space-y-3">
                {['English', 'Spanish', 'French', 'German', 'Japanese', 'Hindi'].map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLanguage(l); setShowLangPicker(false); }}
                    className={`w-full p-5 rounded-2xl flex items-center justify-between text-lg font-bold transition-all ${language === l ? 'bg-ios-blue text-white shadow-lg scale-[1.02]' : 'bg-ios-secondary-bg hover:bg-ios-separator'}`}
                  >
                    <span>{l}</span>
                    {language === l && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-ios-blue rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPrivacy(false)}
              className="absolute inset-0 bg-black/40 z-[160] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-3xl z-[170] p-6 pb-12 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="w-12 h-1 bg-ios-separator rounded-full mx-auto mb-6 flex-shrink-0" />
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="text-xl font-bold">Privacy Policy</h3>
                <button onClick={() => setShowPrivacy(false)} className="p-2 bg-ios-secondary-bg rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto space-y-4 text-sm text-ios-secondary-label pr-2">
                <p>Your privacy is important to us. This policy explains how we handle your data in Lumina Gallery.</p>
                <div className="space-y-2">
                  <h4 className="font-bold text-ios-label">1. Data Storage</h4>
                  <p>All your photos and edits are stored locally on your device. We do not upload your images to any external servers without your explicit permission.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-ios-label">2. Permissions</h4>
                  <p>We request access to your photo library to display and organize your memories. Location data is used only to show where your photos were taken.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-ios-label">3. Analytics</h4>
                  <p>We may collect anonymous usage data to improve the app's performance and stability.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-ios-label">4. Third Parties</h4>
                  <p>We do not sell or share your personal information or media with third-party advertising companies.</p>
                </div>
                <div className="pt-6">
                  <p className="italic">Last updated: April 2026</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRating(false)}
              className="absolute inset-0 bg-black/40 z-[160] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-3xl z-[170] p-8 pb-12 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-12 h-1 bg-ios-separator rounded-full mb-8 flex-shrink-0" />
              
              <AnimatePresence mode="wait">
                {ratingStep === 'stars' ? (
                  <motion.div 
                    key="stars"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full"
                  >
                    <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                      <Star size={40} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2">Enjoying Lumina?</h3>
                    <p className="text-ios-secondary-label text-sm mb-8">Tap a star to rate it on the App Store</p>
                    
                    <div className="flex justify-center gap-2 mb-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => { setSelectedStars(star); setTimeout(() => setRatingStep('thanks'), 400); }}
                          className={`p-1 transition-all duration-300 ${selectedStars >= star ? 'scale-125' : 'scale-100 opacity-40 hover:opacity-100'}`}
                        >
                          <Star 
                            size={42} 
                            className={`${selectedStars >= star ? 'text-yellow-500 fill-yellow-500' : 'text-ios-secondary-label'}`} 
                          />
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowRating(false)}
                      className="text-ios-secondary-label font-bold text-sm hover:underline"
                    >
                      Not Now
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="thanks"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Check size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2">Thank You!</h3>
                    <p className="text-ios-secondary-label text-sm mb-8">Your feedback helps us make Lumina even better for everyone.</p>
                    
                    <button 
                      onClick={() => setShowRating(false)}
                      className="w-full py-4 bg-ios-blue text-white rounded-2xl font-bold transition-all active:scale-95"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
