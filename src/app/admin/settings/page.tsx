"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Building2,
  MapPin,
  Mail,
  Phone,
  Plus,
  Trash2,
  Globe,
  FileText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Eye,
  EyeOff,
  Users,
  Code2,
  User,
  Upload,
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import { ICreatorMember, ISupportMember } from "@/models/SiteSettings";
import { uploadMediaAction } from "@/actions/upload";
import {
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  AdminUserData,
} from "@/actions/admin-users";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import ConnectedAccountsManager from "@/components/media/ConnectedAccountsManager";

interface LinkItem {
  label: string;
  href: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form State
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [departments, setDepartments] = useState<LinkItem[]>([]);
  const [copyrightText, setCopyrightText] = useState("");
  const [councilNote, setCouncilNote] = useState("");

  // Social & AI Settings State
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [socialWebhookUrl, setSocialWebhookUrl] = useState("");
  const [defaultHashtags, setDefaultHashtags] = useState("#CampusPulse #CollegeLife #CampusEvents");
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // About Page & Project Creators State
  const [aboutBadge, setAboutBadge] = useState("PROJECT DEVELOPERS & ARCHITECTS");
  const [aboutTitle, setAboutTitle] = useState("Meet the Creators Behind CampusPulse");
  const [aboutSubtitle, setAboutSubtitle] = useState("Built with passion by university engineering students for modern, paperless campus events.");
  const [aboutProjectStory, setAboutProjectStory] = useState("");
  const [aboutTechStack, setAboutTechStack] = useState("Next.js 16, TypeScript, Tailwind CSS, MongoDB, Framer Motion, Capacitor Android");
  const [creators, setCreators] = useState<ICreatorMember[]>([
    {
      id: "creator-1",
      name: "Mohd Noaman",
      role: "Lead Full-Stack Developer & Project Architect",
      department: "Dept. of Computer Science & Engineering",
      college: "P. R. Pote Patil College of Engineering, Amravati",
      bio: "Passionate engineer specializing in full-stack architecture, building intuitive, modern web apps and high-performance digital systems for educational institutions.",
      avatarUrl: "",
      githubUrl: "https://github.com/noaman024",
      linkedinUrl: "",
      email: "mdnoaman024@gmail.com",
      portfolioUrl: "",
      highlights: ["System Architecture", "Next.js & React 19", "MongoDB Database", "Capacitor Mobile APK"],
    },
  ]);
  const [uploadingAvatarIdx, setUploadingAvatarIdx] = useState<number | null>(null);

  // Support Team Members State (Unlimited dynamic members)
  const [supportMembers, setSupportMembers] = useState<ISupportMember[]>([
    {
      id: "support-1",
      name: "Student Technical Council",
      role: "Campus Ambassador & Technical Support",
      department: "Computer Science & Engineering",
      avatarUrl: "",
      email: "support@campuspulse.edu",
      phone: "+91 98765 43210",
      linkedinUrl: "",
      notes: "Assisting students with event queries, ticket verification, and digital feedback.",
    },
  ]);
  const [uploadingSupportAvatarIdx, setUploadingSupportAvatarIdx] = useState<number | null>(null);

  // New department input state
  const [newDeptLabel, setNewDeptLabel] = useState("");
  const [newDeptHref, setNewDeptHref] = useState("");

  // Admin Team Management State
  const [adminUsers, setAdminUsers] = useState<AdminUserData[]>([]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminDept, setNewAdminDept] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const loadAdmins = async () => {
    try {
      const list = await getAdminUsers();
      setAdminUsers(list);
    } catch (err) {
      console.error("Failed to load admin users:", err);
    }
  };

  useEffect(() => {
    Promise.all([
      getSiteSettings(),
      getAdminUsers().catch(() => []),
    ])
      .then(([settingsData, adminsData]) => {
        if (settingsData) {
          setSiteName(settingsData.siteName || "CampusPulse");
          setDescription(settingsData.description || "");
          setOfficeName(settingsData.officeName || "");
          setOfficeLocation(settingsData.officeLocation || "");
          setContactEmail(settingsData.contactEmail || "");
          setContactPhone(settingsData.contactPhone || "");
          setDepartments(settingsData.departments || []);
          setCopyrightText(settingsData.copyrightText || "");
          setCouncilNote(settingsData.councilNote || "");
          if (settingsData.socialSettings) {
            setGeminiApiKey(settingsData.socialSettings.geminiApiKey || "");
            setSocialWebhookUrl(settingsData.socialSettings.socialWebhookUrl || "");
            setDefaultHashtags(settingsData.socialSettings.defaultHashtags || "#CampusPulse #CollegeLife #CampusEvents");
          }
          if (settingsData.aboutSettings) {
            if (settingsData.aboutSettings.badge) setAboutBadge(settingsData.aboutSettings.badge);
            if (settingsData.aboutSettings.title) setAboutTitle(settingsData.aboutSettings.title);
            if (settingsData.aboutSettings.subtitle) setAboutSubtitle(settingsData.aboutSettings.subtitle);
            if (settingsData.aboutSettings.projectStory) setAboutProjectStory(settingsData.aboutSettings.projectStory);
            if (settingsData.aboutSettings.techStack) {
              setAboutTechStack(
                Array.isArray(settingsData.aboutSettings.techStack)
                  ? settingsData.aboutSettings.techStack.join(", ")
                  : settingsData.aboutSettings.techStack
              );
            }
            if (settingsData.aboutSettings.creators && Array.isArray(settingsData.aboutSettings.creators) && settingsData.aboutSettings.creators.length > 0) {
              setCreators(settingsData.aboutSettings.creators);
            }
            if (settingsData.aboutSettings.supportMembers && Array.isArray(settingsData.aboutSettings.supportMembers)) {
              setSupportMembers(settingsData.aboutSettings.supportMembers);
            }
          }
        }
        if (adminsData && Array.isArray(adminsData)) {
          setAdminUsers(adminsData);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setToast({ message: "Failed to load current settings", type: "error" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const res = await createAdminUser({
        name: newAdminName,
        email: newAdminEmail,
        department: newAdminDept,
        password: newAdminPassword,
      });
      setToast({ message: res.message || "Admin created successfully!", type: "success" });
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminDept("");
      setNewAdminPassword("");
      await loadAdmins();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to create administrator",
        type: "error",
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to remove administrator access for ${adminName}?`)) {
      return;
    }
    try {
      const res = await deleteAdminUser(adminId);
      setToast({ message: res.message, type: "success" });
      await loadAdmins();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to delete admin account",
        type: "error",
      });
    }
  };

  const handleAddDepartment = () => {
    if (!newDeptLabel.trim()) return;
    setDepartments([
      ...departments,
      {
        label: newDeptLabel.trim(),
        href: newDeptHref.trim() || `/events?search=${encodeURIComponent(newDeptLabel.trim())}`,
      },
    ]);
    setNewDeptLabel("");
    setNewDeptHref("");
  };

  const handleRemoveDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  // Creator profile handlers
  const handleUpdateCreator = (index: number, field: keyof ICreatorMember, value: unknown) => {
    setCreators((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddCreator = () => {
    setCreators((prev) => [
      ...prev,
      {
        id: `creator-${Date.now()}`,
        name: "",
        role: "Developer / Contributor",
        department: "",
        college: "",
        bio: "",
        avatarUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        email: "",
        portfolioUrl: "",
        highlights: [],
      },
    ]);
  };

  const handleRemoveCreator = (index: number) => {
    if (creators.length <= 1) {
      setToast({ message: "At least one creator profile should remain.", type: "error" });
      return;
    }
    setCreators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAvatarUpload = async (index: number, file: File) => {
    setUploadingAvatarIdx(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      let fileUrl = "";
      try {
        const res = await uploadMediaAction(formData);
        if (res.success && res.url) fileUrl = res.url;
      } catch {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        fileUrl = data.url;
      }
      if (fileUrl) {
        handleUpdateCreator(index, "avatarUrl", fileUrl);
        setToast({ message: "Creator photo uploaded successfully!", type: "success" });
      }
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to upload creator photo",
        type: "error",
      });
    } finally {
      setUploadingAvatarIdx(null);
    }
  };

  // Support Team Members handlers (Unlimited dynamic additions)
  const handleUpdateSupportMember = (index: number, field: keyof ISupportMember, value: unknown) => {
    setSupportMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddSupportMember = () => {
    setSupportMembers((prev) => [
      ...prev,
      {
        id: `support-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: "",
        role: "Event Coordinator / Support Volunteer",
        department: "",
        avatarUrl: "",
        email: "",
        phone: "",
        linkedinUrl: "",
        notes: "",
      },
    ]);
  };

  const handleRemoveSupportMember = (index: number) => {
    setSupportMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSupportAvatarUpload = async (index: number, file: File) => {
    setUploadingSupportAvatarIdx(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      let fileUrl = "";
      try {
        const res = await uploadMediaAction(formData);
        if (res.success && res.url) fileUrl = res.url;
      } catch {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        fileUrl = data.url;
      }
      if (fileUrl) {
        handleUpdateSupportMember(index, "avatarUrl", fileUrl);
        setToast({ message: "Support member photo uploaded successfully!", type: "success" });
      }
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to upload member photo",
        type: "error",
      });
    } finally {
      setUploadingSupportAvatarIdx(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({
        siteName,
        description,
        officeName,
        officeLocation,
        contactEmail,
        contactPhone,
        departments,
        copyrightText,
        councilNote,
        aboutSettings: {
          badge: aboutBadge,
          title: aboutTitle,
          subtitle: aboutSubtitle,
          projectStory: aboutProjectStory,
          techStack: aboutTechStack.split(",").map((s) => s.trim()).filter(Boolean),
          creators: creators,
          supportMembers: supportMembers,
        },
        socialSettings: {
          geminiApiKey,
          socialWebhookUrl,
          defaultHashtags,
        },
      });
      setToast({ message: "Site, Creator & Support settings updated successfully!", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update settings",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading settings..." fullPage />;
  }

  return (
    <div className="p-3.5 sm:p-5 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 overflow-x-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
            >
              Portal Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 tracking-tight break-words">
            Site & Administrator Settings
          </h1>
          <p className="text-xs mt-1 text-muted-foreground break-words">
            Manage administrators, footer information, contact details, departments, and copyright attribution.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-sm flex items-center justify-center gap-2 rounded-xl shadow-md w-full sm:w-auto flex-shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>

      {/* Section 0: Administrator Team & Access Management */}
      <div
        className="p-4 sm:p-6 rounded-2xl border space-y-5 overflow-hidden"
        style={{
          background: "hsl(var(--surface-raised))",
          borderColor: "hsl(var(--border))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(var(--primary) / 0.15)" }}
            >
              <UserCheck className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-foreground truncate">Administrator Accounts & Team</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                Create new administrators and manage current university administrative access
              </p>
            </div>
          </div>
          <span className="badge badge-primary text-xs w-fit flex-shrink-0">
            {adminUsers.length} Active {adminUsers.length === 1 ? "Admin" : "Admins"}
          </span>
        </div>

        {/* Existing Admins List */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Current Active Administrators
          </p>
          {adminUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">Loading administrators...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {adminUsers.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-card/60 gap-2"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}
                    >
                      {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{admin.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{admin.email}</p>
                      <p className="text-[10px] text-primary truncate font-medium">{admin.department}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
                    title={`Remove admin access for ${admin.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Admin Form */}
        <div className="pt-3 border-t space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-primary" /> Create New Administrator
          </p>
          <form onSubmit={handleCreateAdmin} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1 text-foreground">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Dr. Priya Singh"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1 text-foreground">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="priya.singh@university.edu"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1 text-foreground">
                  Department / Designation *
                </label>
                <input
                  type="text"
                  value={newAdminDept}
                  onChange={(e) => setNewAdminDept(e.target.value)}
                  placeholder="e.g. Head of Computer Science"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1 text-foreground">
                  Password (Min. 6 chars) *
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field text-xs pr-9"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={creatingAdmin}
                className="btn-primary py-2 px-5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {creatingAdmin ? "Creating Administrator..." : "Create Administrator Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Description */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--primary) / 0.12)" }}
              >
                <Globe className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Brand & Portal Overview</h2>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Name and description shown on the website footer
                </p>
              </div>
            </div>

            {/* Delete button shifted to the right */}
            <button
              type="button"
              onClick={() => {
                setSiteName("");
                setDescription("");
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete and clear all details from this box"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Box Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Portal Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. CampusPulse"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Footer Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Official university event management system..."
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Office Details */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--accent) / 0.12)" }}
              >
                <Building2 className="w-4 h-4" style={{ color: "hsl(var(--accent))" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Office & Contact Details</h2>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  University department office, physical location, and support channels
                </p>
              </div>
            </div>

            {/* Delete button shifted to the right */}
            <button
              type="button"
              onClick={() => {
                setOfficeName("");
                setOfficeLocation("");
                setContactEmail("");
                setContactPhone("");
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete and clear all details from this box"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Box Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-foreground">
                <Building2 className="w-3.5 h-3.5 text-accent" />
                Office / Authority Name
              </label>
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="e.g. Office of Student Affairs"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Campus Location / Address
              </label>
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                placeholder="e.g. Main Academic Block, North Campus"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-foreground">
                <Mail className="w-3.5 h-3.5 text-accent" />
                Official Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. events@campuspulse.edu"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-foreground">
                <Phone className="w-3.5 h-3.5 text-accent" />
                Official Contact Phone (Optional)
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Manage Departments List */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(160 84% 38% / 0.12)" }}
              >
                <FileText className="w-4 h-4" style={{ color: "hsl(160 84% 38%)" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">University Departments</h2>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Active departments displayed in the footer
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {departments.length} Listed
            </span>
          </div>

          {/* List of current departments */}
          <div className="space-y-2">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border transition-all"
                style={{
                  background: "hsl(var(--surface))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{dept.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{dept.href}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDepartment(idx)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                  title="Remove Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new department inputs */}
          <div className="pt-3 border-t flex flex-col sm:flex-row gap-2" style={{ borderColor: "hsl(var(--border))" }}>
            <input
              type="text"
              value={newDeptLabel}
              onChange={(e) => setNewDeptLabel(e.target.value)}
              placeholder="Department Name (e.g. Electrical Engineering)"
              className="input-field text-xs flex-1"
            />
            <input
              type="text"
              value={newDeptHref}
              onChange={(e) => setNewDeptHref(e.target.value)}
              placeholder="Link (optional, defaults to search)"
              className="input-field text-xs flex-1"
            />
            <button
              type="button"
              onClick={handleAddDepartment}
              className="btn-secondary py-2 px-4 text-xs flex items-center justify-center gap-1 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Section 4: Copyright & Council Notes */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(35 92% 45% / 0.12)" }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: "hsl(35 92% 45%)" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Copyright & Council Attribution</h2>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Bottom bar text shown across all pages
                </p>
              </div>
            </div>

            {/* Delete button shifted to the right */}
            <button
              type="button"
              onClick={() => {
                setCopyrightText("");
                setCouncilNote("");
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete and clear all details from this box"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Box Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Copyright Text (Year is added automatically)
              </label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="e.g. CampusPulse. All rights reserved. University Event Portal."
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Council / Author Attribution Note
              </label>
              <input
                type="text"
                value={councilNote}
                onChange={(e) => setCouncilNote(e.target.value)}
                placeholder="e.g. Student Affairs & Technical Council"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Project Creators & About Page Settings */}
        <div
          id="creators"
          className="p-6 rounded-2xl border space-y-6 scroll-mt-24"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-500/15 text-violet-400 border border-violet-500/20"
              >
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-foreground">Project Creators & About Page Showcase</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/25 uppercase">
                    Customizable
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Configure developer profiles, photos, social links, college info, and about page text shown on <a href="/about" target="_blank" className="text-primary underline hover:opacity-80">/about</a>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCreator}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Creator
            </button>
          </div>

          {/* Top-Level Page Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Page Header Badge
              </label>
              <input
                type="text"
                value={aboutBadge}
                onChange={(e) => setAboutBadge(e.target.value)}
                placeholder="e.g. PROJECT DEVELOPERS & ARCHITECTS"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Main Page Title
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                placeholder="e.g. Meet the Creators Behind CampusPulse"
                className="input-field text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Page Subtitle / Mission Statement
              </label>
              <input
                type="text"
                value={aboutSubtitle}
                onChange={(e) => setAboutSubtitle(e.target.value)}
                placeholder="e.g. Built with passion by university engineering students for modern, paperless campus events."
                className="input-field text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Why This Project Was Built (Origin Story)
              </label>
              <textarea
                rows={3}
                value={aboutProjectStory}
                onChange={(e) => setAboutProjectStory(e.target.value)}
                placeholder="Share the vision, college journey, and what problem CampusPulse solves..."
                className="input-field text-xs resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Tech Stack Tags (Comma separated)
              </label>
              <input
                type="text"
                value={aboutTechStack}
                onChange={(e) => setAboutTechStack(e.target.value)}
                placeholder="e.g. Next.js 16, TypeScript, Tailwind CSS, MongoDB, Framer Motion, Capacitor"
                className="input-field text-xs"
              />
            </div>
          </div>

          {/* Creators List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-violet-400" />
              Creator Profiles ({creators.length})
            </h3>

            {creators.map((creator, idx) => (
              <div
                key={creator.id || idx}
                className="p-4 sm:p-5 rounded-xl border border-white/10 bg-black/15 space-y-4 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center border border-violet-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {creator.name || `Creator #${idx + 1}`}
                    </span>
                    {creator.role && (
                      <span className="text-[10px] text-muted-foreground">({creator.role})</span>
                    )}
                  </div>

                  {creators.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCreator(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Remove this creator"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => handleUpdateCreator(idx, "name", e.target.value)}
                      placeholder="e.g. Mohd Noaman"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      value={creator.role}
                      onChange={(e) => handleUpdateCreator(idx, "role", e.target.value)}
                      placeholder="e.g. Lead Full-Stack Developer & Project Architect"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Department / Branch
                    </label>
                    <input
                      type="text"
                      value={creator.department || ""}
                      onChange={(e) => handleUpdateCreator(idx, "department", e.target.value)}
                      placeholder="e.g. Dept. of Computer Science & Engineering"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={creator.college || ""}
                      onChange={(e) => handleUpdateCreator(idx, "college", e.target.value)}
                      placeholder="e.g. P. R. Pote Patil College of Engineering, Amravati"
                      className="input-field text-xs"
                    />
                  </div>

                  {/* Avatar Upload & URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold mb-1 text-foreground flex items-center justify-between">
                      <span>Creator Photo / Avatar</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Upload photo or paste image URL</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Avatar preview */}
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-violet-950/40 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                        {creator.avatarUrl ? (
                          <img
                            src={creator.avatarUrl}
                            alt={creator.name || "Avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-violet-400 font-bold text-sm">
                            {creator.name ? creator.name.slice(0, 2).toUpperCase() : "IMG"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="url"
                          value={creator.avatarUrl || ""}
                          onChange={(e) => handleUpdateCreator(idx, "avatarUrl", e.target.value)}
                          placeholder="https://example.com/photo.jpg or upload below"
                          className="input-field text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-foreground cursor-pointer flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-violet-400" />
                            {uploadingAvatarIdx === idx ? "Uploading Photo..." : "Upload Photo File"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAvatarUpload(idx, file);
                              }}
                            />
                          </label>
                          {creator.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCreator(idx, "avatarUrl", "")}
                              className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                            >
                              Clear photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Bio / Description
                    </label>
                    <textarea
                      rows={2}
                      value={creator.bio || ""}
                      onChange={(e) => handleUpdateCreator(idx, "bio", e.target.value)}
                      placeholder="Passionate engineer specializing in full-stack web and mobile apps..."
                      className="input-field text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={creator.githubUrl || ""}
                      onChange={(e) => handleUpdateCreator(idx, "githubUrl", e.target.value)}
                      placeholder="https://github.com/username"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={creator.linkedinUrl || ""}
                      onChange={(e) => handleUpdateCreator(idx, "linkedinUrl", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={creator.email || ""}
                      onChange={(e) => handleUpdateCreator(idx, "email", e.target.value)}
                      placeholder="developer@gmail.com"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Portfolio / Personal Website URL
                    </label>
                    <input
                      type="url"
                      value={creator.portfolioUrl || ""}
                      onChange={(e) => handleUpdateCreator(idx, "portfolioUrl", e.target.value)}
                      placeholder="https://myportfolio.com"
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Key Highlights / Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={creator.highlights ? creator.highlights.join(", ") : ""}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                        handleUpdateCreator(idx, "highlights", tags);
                      }}
                      placeholder="e.g. System Architecture, React 19, MongoDB, Capacitor Native"
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section: Support Team Members (Multiply / Dynamic Unlimited) */}
          <div id="support-members" className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Project Support Members & Student Volunteers ({supportMembers.length})
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase">
                    Unlimited
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Aap kitne bhi support members, event coordinators, ya volunteers add kar sakte hain with photos and contact details.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSupportMember}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Support Member
              </button>
            </div>

            {supportMembers.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-white/15 text-center space-y-2 bg-black/10">
                <p className="text-xs text-muted-foreground">Abhi koi support member add nahi hai.</p>
                <button
                  type="button"
                  onClick={handleAddSupportMember}
                  className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Pehla Support Member Add Karein
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {supportMembers.map((member, sIdx) => (
                  <div
                    key={member.id || sIdx}
                    className="p-4 sm:p-5 rounded-xl border border-white/10 bg-black/20 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {member.name || `Support Member #${sIdx + 1}`}
                        </span>
                        {member.role && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {member.role}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSupportMember(sIdx)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer text-xs flex items-center gap-1"
                        title="Remove this support member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Member Full Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "name", e.target.value)}
                          placeholder="e.g. Student Coordinator Name"
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Role / Responsibility *
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "role", e.target.value)}
                          placeholder="e.g. Campus Ambassador / Technical Support Lead"
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Department / Branch
                        </label>
                        <input
                          type="text"
                          value={member.department || ""}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "department", e.target.value)}
                          placeholder="e.g. Dept. of Computer Science & Engineering"
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Contact Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={member.phone || ""}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className="input-field text-xs"
                        />
                      </div>

                      {/* Photo Upload & URL */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold mb-1 text-foreground flex items-center justify-between">
                          <span>Member Photo / Avatar</span>
                          <span className="text-[10px] text-muted-foreground font-normal">Upload photo file or paste image URL</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name || "Avatar"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-emerald-400 font-bold text-xs">
                                {member.name ? member.name.slice(0, 2).toUpperCase() : "SUP"}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-1.5">
                            <input
                              type="url"
                              value={member.avatarUrl || ""}
                              onChange={(e) => handleUpdateSupportMember(sIdx, "avatarUrl", e.target.value)}
                              placeholder="https://example.com/photo.jpg or upload below"
                              className="input-field text-xs"
                            />
                            <div className="flex items-center gap-2">
                              <label className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-foreground cursor-pointer flex items-center gap-1 transition-colors">
                                <Upload className="w-3 h-3 text-emerald-400" />
                                {uploadingSupportAvatarIdx === sIdx ? "Uploading..." : "Upload Photo File"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSupportAvatarUpload(sIdx, file);
                                  }}
                                />
                              </label>
                              {member.avatarUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSupportMember(sIdx, "avatarUrl", "")}
                                  className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                                >
                                  Clear photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={member.email || ""}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "email", e.target.value)}
                          placeholder="member@campuspulse.edu"
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={member.linkedinUrl || ""}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "linkedinUrl", e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold mb-1 text-foreground">
                          Contribution / Role Notes
                        </label>
                        <input
                          type="text"
                          value={member.notes || ""}
                          onChange={(e) => handleUpdateSupportMember(sIdx, "notes", e.target.value)}
                          placeholder="e.g. Managing ticket desk, attendee helpdesk, and live event support."
                          className="input-field text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSupportMember}
                  className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Support Member (+1)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Social Media Broadcast & Webhook Automation */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: "hsl(var(--surface-raised))",
            borderColor: "hsl(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/15"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Social Media Broadcast Studio & Webhook</h2>
                <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                  Configure caption generator and Webhook for instant multi-platform posting
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Cloud Caption API Key */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground flex items-center justify-between">
                <span>Cloud Caption API Key (Google Cloud / Gemini)</span>
                <span className="text-[10px] text-blue-400 font-normal">Powers Smart Captions & Multi-Platform Posting</span>
              </label>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter API key (Leave empty to use built-in smart engine)"
                  className="input-field text-sm pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Optional cloud API key for automated caption generation. If empty, CampusPulse uses its built-in smart campus template engine.
              </p>
            </div>

            {/* Social Webhook URL */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground flex items-center justify-between">
                <span>Social Media Webhook URL (Zapier / Buffer / Make)</span>
                <span className="text-[10px] text-emerald-400 font-normal">Auto-post to Instagram/Facebook/LinkedIn</span>
              </label>
              <input
                type="url"
                value={socialWebhookUrl}
                onChange={(e) => setSocialWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/... or https://hook.eu1.make.com/..."
                className="input-field text-sm font-mono text-xs"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                When you click &ldquo;Publish to All&rdquo; in the Social Studio, CampusPulse sends a structured JSON payload to this webhook.
              </p>
            </div>

            {/* Default Hashtags */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Default Campus Hashtags
              </label>
              <input
                type="text"
                value={defaultHashtags}
                onChange={(e) => setDefaultHashtags(e.target.value)}
                placeholder="#CampusPulse #CollegeLife #UniversityEvents"
                className="input-field text-sm"
              />
            </div>

            {/* Connected Social Accounts Manager */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-foreground">Linked Social Media Accounts</h3>
                <p className="text-[11px] text-muted-foreground">
                  Connect your campus Instagram, Facebook Page, Twitter/X, LinkedIn, and Telegram accounts for direct 1-click publishing
                </p>
              </div>
              <ConnectedAccountsManager />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8 text-sm flex items-center gap-2 rounded-xl shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
