"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { ShieldAlert, User, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState(user?.username ?? "");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(t("common.settingsSaved"));
    }, 600);
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <h1 className="text-2xl font-bold text-ink-900 dark:text-surface-100 mb-6 tracking-tight">
        {t("settings.title")}
      </h1>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 flex items-center justify-center">
                <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <CardTitle>{t("settings.profile")}</CardTitle>
                <CardDescription>{t("settings.profileDesc")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="mt-4 space-y-4">
            <Input
              label={t("common.email")}
              value={user?.email ?? ""}
              disabled
            />
            <Input
              label={t("common.username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleSave} loading={saving} size="md">
              <Save className="h-4 w-4" />
              {t("common.saveChanges")}
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-red-600 dark:text-red-400">
                  {t("settings.dangerZone")}
                </CardTitle>
                <CardDescription>{t("settings.dangerDesc")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="mt-4">
            <Button variant="danger" onClick={logout}>
              {t("common.signOut")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
