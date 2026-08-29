"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building,
  Lock,
  Bell,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Key,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile Form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    bio: "Passionate campus learner & technology enthusiast.",
  });

  // Password Form
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [savingPass, setSavingPass] = useState(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    feedbackAlerts: true,
    qnaAnswers: true,
    marketingUpdates: false,
  });

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        department: (session.user as any).department || "Computer Science",
      }));
    }
  }, [session]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: "Profile settings updated successfully!", type: "success" });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      setToast({ message: "New passwords do not match", type: "error" });
      return;
    }
    setSavingPass(true);
    setTimeout(() => {
      setSavingPass(false);
      setPasswords({ current: "", newPass: "", confirmPass: "" });
      setToast({ message: "Password updated successfully!", type: "success" });
    }, 600);
  };

  return (
    <div className="min-h-screen gradient-mesh py-10 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Account Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal profile, institutional details, security credentials, and alert preferences.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 glass-card rounded-xl border w-fit text-xs" style={{ borderColor: "hsl(var(--border))" }}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "profile" ? "btn-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile & Identity
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "security" ? "btn-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Security & Passwords
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "notifications" ? "btn-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Notifications
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSaveProfile} className="glass-card p-6 rounded-2xl border space-y-5" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-center gap-4 border-b pb-5" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{profile.name || "Student User"}</h3>
                  <span className="badge badge-primary text-[10px] capitalize">
                    {session?.user?.role || "Student"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-foreground">
                    <User className="w-3.5 h-3.5 inline mr-1" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-foreground">
                    <Mail className="w-3.5 h-3.5 inline mr-1" /> University Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="input-field text-xs opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-foreground">
                    <Building className="w-3.5 h-3.5 inline mr-1" /> Academic Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-foreground">
                    Role & Authorization
                  </label>
                  <input
                    type="text"
                    value={session?.user?.role === "admin" ? "University Administrator" : "Verified Student"}
                    disabled
                    className="input-field text-xs opacity-60 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5 text-foreground">
                  Short Bio / Interests
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button type="submit" className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSavePassword} className="glass-card p-6 rounded-2xl border space-y-5" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="border-b pb-3" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="font-bold text-base text-foreground">Change Password</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ensure your account uses a strong password with at least 8 characters.
                </p>
              </div>

              <div className="space-y-3 max-w-md">
                <div>
                  <label className="text-xs font-semibold block mb-1 text-foreground">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-foreground">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button type="submit" disabled={savingPass} className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> {savingPass ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-card p-6 rounded-2xl border space-y-4" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="border-b pb-3" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="font-bold text-base text-foreground">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose which alerts and email reminders you wish to receive.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { key: "eventReminders", label: "Event RSVP & Schedule Reminders", desc: "Get notified 24 hours before registered events commence" },
                  { key: "feedbackAlerts", label: "Post-Event Feedback Surveys", desc: "Receive survey requests once events conclude" },
                  { key: "qnaAnswers", label: "Live Q&A Answer Notifications", desc: "Alert when a faculty organizer answers your question" },
                  { key: "marketingUpdates", label: "Campus Club Newsletters & Highlights", desc: "Monthly roundup of major campus competitions" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                    style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifications as any)[item.key]}
                      onChange={(e) =>
                        setNotifications({ ...notifications, [item.key]: e.target.checked })
                      }
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  onClick={() => setToast({ message: "Notification preferences saved!", type: "success" })}
                  className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
