"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  Power,
  X,
} from "lucide-react";
import {
  getConnectedAccountsAction,
  saveSocialAccountAction,
  testSocialConnectionAction,
  disconnectSocialAccountAction,
  ConnectedAccountSummary,
} from "@/actions/social";

interface PlatformConfigDef {
  id: "instagram" | "facebook" | "twitter" | "linkedin" | "telegram" | "universal";
  name: string;
  icon: string;
  badgeColor: string;
  description: string;
  helpLinkText: string;
  helpUrl: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "password";
    placeholder: string;
    help?: string;
  }[];
}

const PLATFORM_DEFINITIONS: PlatformConfigDef[] = [
  {
    id: "instagram",
    name: "Instagram Business",
    icon: "📸",
    badgeColor: "from-pink-500 via-purple-500 to-amber-500",
    description: "Auto-publish photo highlights & event reels directly to your Instagram Business account.",
    helpLinkText: "How to get Meta Token",
    helpUrl: "https://developers.facebook.com/docs/instagram-api",
    fields: [
      { key: "handle", label: "Instagram Handle", type: "text", placeholder: "e.g. campuspulse_official" },
      { key: "accountId", label: "Instagram Business Account ID", type: "text", placeholder: "e.g. 17841405..." },
      { key: "accessToken", label: "Meta Graph User/Page Access Token", type: "password", placeholder: "EAAB..." },
    ],
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: "📘",
    badgeColor: "from-blue-600 to-indigo-700",
    description: "Post event photos and long-form announcements to your official Facebook campus page.",
    helpLinkText: "Meta Pages API Guide",
    helpUrl: "https://developers.facebook.com/docs/pages",
    fields: [
      { key: "pageName", label: "Facebook Page Name", type: "text", placeholder: "e.g. CampusPulse University" },
      { key: "pageId", label: "Facebook Page ID", type: "text", placeholder: "e.g. 1029384756..." },
      { key: "accessToken", label: "Page Access Token", type: "password", placeholder: "EAAB..." },
    ],
  },
  {
    id: "twitter",
    name: "Twitter / X Account",
    icon: "🐦",
    badgeColor: "from-neutral-800 to-black",
    description: "Tweet live event announcements and highlight links under your official handle.",
    helpLinkText: "X Developer Portal",
    helpUrl: "https://developer.x.com/en/portal/dashboard",
    fields: [
      { key: "handle", label: "Twitter Handle", type: "text", placeholder: "e.g. CampusPulseUniv" },
      { key: "apiKey", label: "Consumer API Key", type: "password", placeholder: "API Key" },
      { key: "apiSecret", label: "Consumer API Secret", type: "password", placeholder: "API Secret" },
      { key: "accessToken", label: "Access Token", type: "password", placeholder: "Access Token" },
      { key: "accessSecret", label: "Access Token Secret", type: "password", placeholder: "Access Token Secret" },
      { key: "bearerToken", label: "Bearer Token (v2)", type: "password", placeholder: "Bearer Token" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Organization",
    icon: "💼",
    badgeColor: "from-blue-700 to-sky-700",
    description: "Share academic achievements, guest lectures, and student symposiums on your institution page.",
    helpLinkText: "LinkedIn Developer Portal",
    helpUrl: "https://www.linkedin.com/developers/",
    fields: [
      { key: "orgName", label: "Organization / University Name", type: "text", placeholder: "e.g. CampusPulse Portal" },
      { key: "orgUrn", label: "Organization URN ID", type: "text", placeholder: "e.g. urn:li:organization:123456" },
      { key: "accessToken", label: "OAuth 2.0 Access Token", type: "password", placeholder: "AQV..." },
    ],
  },
  {
    id: "telegram",
    name: "Telegram Channel / Group",
    icon: "✈️",
    badgeColor: "from-sky-500 to-blue-600",
    description: "Instant 1-minute setup! Broadcast photo updates directly to your students channel without any review.",
    helpLinkText: "Create a bot via @BotFather in Telegram",
    helpUrl: "https://t.me/BotFather",
    fields: [
      { key: "channelHandle", label: "Channel Username or Group Name", type: "text", placeholder: "e.g. campuspulse_events" },
      { key: "botToken", label: "Telegram Bot Token (from @BotFather)", type: "password", placeholder: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" },
      { key: "chatId", label: "Channel Chat ID (e.g. @channel_name or -100123...)", type: "text", placeholder: "@my_campus_channel or -1001928374" },
    ],
  },
  {
    id: "universal",
    name: "Universal Aggregator (Ayrshare / Buffer)",
    icon: "⚡",
    badgeColor: "from-indigo-600 to-purple-600",
    description: "Connect 1 single API key that automatically posts to Instagram, FB, X & LinkedIn simultaneously!",
    helpLinkText: "Ayrshare API Key / Buffer Webhook",
    helpUrl: "https://www.ayrshare.com",
    fields: [
      { key: "provider", label: "Aggregator Provider (ayrshare / buffer / webhook)", type: "text", placeholder: "ayrshare" },
      { key: "apiKey", label: "API Key (if using Ayrshare)", type: "password", placeholder: "API-KEY-..." },
      { key: "webhookUrl", label: "Automation Webhook URL (Zapier / Make)", type: "text", placeholder: "https://hooks.zapier.com/..." },
    ],
  },
];

export default function ConnectedAccountsManager() {
  const [accounts, setAccounts] = useState<Record<string, ConnectedAccountSummary>>({});
  const [loading, setLoading] = useState(true);
  const [activeConfigModal, setActiveConfigModal] = useState<PlatformConfigDef | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadStatus = async () => {
    try {
      const data = await getConnectedAccountsAction();
      setAccounts(data);
    } catch (err) {
      console.error("Failed to load connected accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const openConfig = (plat: PlatformConfigDef) => {
    setActiveConfigModal(plat);
    setFormData({
      enabled: accounts[plat.id]?.enabled ? "true" : "false",
      handle: accounts[plat.id]?.displayName || "",
    });
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!activeConfigModal) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSocialConnectionAction(activeConfigModal.id, formData);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConnection = async () => {
    if (!activeConfigModal) return;
    setSaving(true);
    try {
      await saveSocialAccountAction(activeConfigModal.id, {
        ...formData,
        enabled: true,
      });
      await loadStatus();
      setActiveConfigModal(null);
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async (platId: string) => {
    if (!confirm(`Are you sure you want to disconnect this ${platId} account?`)) return;
    try {
      await disconnectSocialAccountAction(platId);
      await loadStatus();
      if (activeConfigModal?.id === platId) setActiveConfigModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-500" />
        Loading connected social channels...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {PLATFORM_DEFINITIONS.map((p) => {
          const acc = accounts[p.id];
          const isConnected = acc?.status === "connected";

          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: isConnected ? "rgba(59, 130, 246, 0.4)" : "hsl(var(--border))",
                boxShadow: isConnected ? "0 0 20px -8px rgba(59, 130, 246, 0.25)" : "var(--shadow-sm)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon}</span>
                    <h3 className="text-xs font-bold text-foreground">{p.name}</h3>
                  </div>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                      Not Linked
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {p.description}
                </p>

                {isConnected && acc?.displayName && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-mono mb-3 truncate flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{acc.displayName}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t flex items-center justify-between gap-2" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  type="button"
                  onClick={() => openConfig(p)}
                  className="btn-primary py-1.5 px-3 text-[11px] font-semibold rounded-lg flex-1 flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>{isConnected ? "Manage Account" : "Connect Account"}</span>
                </button>

                {isConnected && (
                  <button
                    type="button"
                    onClick={() => handleDisconnect(p.id)}
                    className="p-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/15 text-red-400 text-xs transition-colors"
                    title="Disconnect Account"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Configuration Modal */}
      {activeConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4"
            style={{
              background: "linear-gradient(180deg, #111827 0%, #0b0f19 100%)",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeConfigModal.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Connect {activeConfigModal.name}
                  </h3>
                  <a
                    href={activeConfigModal.helpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>{activeConfigModal.helpLinkText}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveConfigModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  testResult.success
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/15 border-red-500/30 text-red-300"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Dynamic Fields */}
            <div className="space-y-3">
              {activeConfigModal.fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={formData[f.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="input-field text-xs bg-slate-900 border-white/10 font-mono"
                  />
                  {f.help && <p className="text-[10px] text-slate-400 mt-0.5">{f.help}</p>}
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="py-2 px-3.5 rounded-xl border border-white/15 hover:border-white/25 bg-slate-900 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveConfigModal(null)}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConnection}
                  disabled={saving}
                  className="btn-primary py-2 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save & Connect"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
