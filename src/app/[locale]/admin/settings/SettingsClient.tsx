"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsClient({ locale }: { locale: string }) {
  const router = useRouter();
  const [settings, setSettings] = useState<{ showPackagesPage: string }>({ showPackagesPage: "true" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings({ showPackagesPage: data.showPackagesPage || "true" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "showPackagesPage", value: settings.showPackagesPage }),
      });
      if (res.ok) {
        alert("Settings saved successfully. Please refresh the website to see changes.");
        router.refresh();
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  const isVisible = settings.showPackagesPage === "true";

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-secondary" size={48} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Website Settings</h1>
        <p className="text-white/40">Manage global website configurations.</p>
      </header>

      <div className="bg-[#12141C] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
        
        {/* Toggle Packages Page Visibility */}
        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              Packages Page Visibility 
              {isVisible ? <Eye size={20} className="text-emerald-400" /> : <EyeOff size={20} className="text-red-400" />}
            </h3>
            <p className="text-sm text-white/40">Control whether the "Packages" link appears in the website navigation bar.</p>
          </div>
          
          <button 
            onClick={() => setSettings(s => ({ ...s, showPackagesPage: isVisible ? "false" : "true" }))}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isVisible ? 'bg-secondary' : 'bg-white/20'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-9' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex justify-end pt-8 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-4 rounded-xl liquid-gradient text-white font-bold shadow-xl disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
