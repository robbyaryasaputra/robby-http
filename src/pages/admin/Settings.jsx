import { useState } from "react";
import { PageHeader } from "../../components/section";
import { Card } from "../../components/data-display";
import { ToggleSwitch, Input, Select, Checkbox } from "../../components/form";
import { Heading, Label, Caption } from "../../components/typography";
import { Button } from "../../components/basic";
import { Alert } from "../../components/feedback";
import { Stack, Divider } from "../../components/layout";
import { Breadcrumb } from "../../components/navigation";
import { Avatar } from "../../components/media";
import { SlideUp } from "../../components/animation";
import { LuUser, LuMail, LuGlobe, LuSave } from "react-icons/lu";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [profileName, setProfileName] = useState("Admin User");
  const [profileEmail, setProfileEmail] = useState("admin@coffeeshop.com");
  const [language, setLanguage] = useState("id");
  const [timezone, setTimezone] = useState("asia-jakarta");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Settings" },
        ]}
      />

      <PageHeader
        title="Settings"
        subtitle="Manage app preferences, theme options, and account settings."
        action={
          <Button variant="primary" icon={LuSave} onClick={handleSave}>
            Save Changes
          </Button>
        }
      />

      {/* Success Alert */}
      {saved && (
        <Alert variant="success" title="Changes Saved" dismissible onDismiss={() => setSaved(false)}>
          All your settings have been saved successfully.
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SlideUp duration={0.4}>
          <Card className="p-6 border border-gray-100 shadow-sm">
            <Stack direction="vertical" spacing="md">
              <div className="flex items-center gap-4">
                <Avatar name={profileName} size="lg" />
                <div>
                  <Heading level={3} className="!text-lg">{profileName}</Heading>
                  <Caption>{profileEmail}</Caption>
                </div>
              </div>

              <Divider spacing="my-2" />

              <Input
                id="settings-name"
                name="name"
                label="Full Name"
                icon={LuUser}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
              />

              <Input
                id="settings-email"
                name="email"
                type="email"
                label="Email Address"
                icon={LuMail}
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <Select
                id="settings-language"
                name="language"
                label="Language"
                icon={LuGlobe}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { label: "Indonesian", value: "id" },
                  { label: "English", value: "en" },
                  { label: "Japanese", value: "ja" },
                ]}
              />

              <Select
                id="settings-timezone"
                name="timezone"
                label="Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { label: "Asia/Jakarta (WIB)", value: "asia-jakarta" },
                  { label: "Asia/Makassar (WITA)", value: "asia-makassar" },
                  { label: "Asia/Jayapura (WIT)", value: "asia-jayapura" },
                ]}
              />
            </Stack>
          </Card>
        </SlideUp>

        {/* General & Security Settings */}
        <Stack direction="vertical" spacing="md">
          <SlideUp duration={0.4} delay={0.1}>
            <Card className="p-6 border border-gray-100 shadow-sm">
              <Heading level={3} className="!text-lg">General</Heading>
              <Caption className="mt-1 block mb-6">
                Configure basic app settings and administrative preferences.
              </Caption>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40">
                  <ToggleSwitch
                    id="setting-darkmode"
                    label="Dark Mode"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                </div>
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40">
                  <ToggleSwitch
                    id="setting-notifications"
                    label="Enable Notifications"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                </div>
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40">
                  <Checkbox
                    id="setting-email-updates"
                    label="Receive email updates about new features"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                  />
                </div>
              </div>
            </Card>
          </SlideUp>

          <SlideUp duration={0.4} delay={0.2}>
            <Card className="p-6 border border-gray-100 shadow-sm">
              <Heading level={3} className="!text-lg">Security</Heading>
              <Caption className="mt-1 block mb-6">
                Update password and access controls for your admin account.
              </Caption>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40 flex items-center justify-between text-sm">
                  <div>
                    <Label>Password</Label>
                    <span className="text-sm font-semibold text-slate-700">••••••••</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Updated 3 days ago</span>
                </div>
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40">
                  <ToggleSwitch
                    id="setting-2fa"
                    label="Two-Factor Authentication (2FA)"
                    checked={twoFA}
                    onChange={(e) => setTwoFA(e.target.checked)}
                  />
                </div>
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/40 flex items-center justify-between text-sm">
                  <div>
                    <Label>Session Timeout</Label>
                    <span className="font-bold text-[#8B5F3C]">30 minutes</span>
                  </div>
                </div>
              </div>
            </Card>
          </SlideUp>
        </Stack>
      </div>
    </div>
  );
}
