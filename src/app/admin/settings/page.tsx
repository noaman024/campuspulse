"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

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

  // New department input state
  const [newDeptLabel, setNewDeptLabel] = useState("");
  const [newDeptHref, setNewDeptHref] = useState("");

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) {
          setSiteName(data.siteName || "CampusPulse");
          setDescription(data.description || "");
          setOfficeName(data.officeName || "");
          setOfficeLocation(data.officeLocation || "");
          setContactEmail(data.contactEmail || "");
          setContactPhone(data.contactPhone || "");
          setDepartments(data.departments || []);
          setCopyrightText(data.copyrightText || "");
          setCouncilNote(data.councilNote || "");
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setToast({ message: "Failed to load current settings", type: "error" });
      })
      .finally(() => setLoading(false));
  }, []);

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
      });
      setToast({ message: "Site settings and footer updated successfully!", type: "success" });
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
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "hsl(var(--border))" }}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
            >
              Portal Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mt-1 tracking-tight">
            Site & Footer Settings
          </h1>
          <p className="text-xs mt-1" style={{ color: "hsl(var(--fg-muted))" }}>
            Edit the footer details, university contact information, departments, and copyright notes in real-time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 rounded-xl shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
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
            <div className="flex items-center gap-3">
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
            </div>
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
            <div className="flex items-center gap-3">
              {/* Delete / Clear Box Button on top left */}
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
            </div>
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
                style={{ background: "hsl(158 64% 38% / 0.12)" }}
              >
                <FileText className="w-4 h-4" style={{ color: "hsl(158 64% 38%)" }} />
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
            <div className="flex items-center gap-3">
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
            </div>
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
