"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");

  function handleSave() {
    toast.success("Settings saved");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your display information</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-4">
            <Input
              label="Email"
              value={user?.email ?? ""}
              disabled
            />
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Sign out of your account</CardDescription>
          </CardHeader>
          <div className="mt-4">
            <Button variant="danger" onClick={logout}>Sign Out</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
