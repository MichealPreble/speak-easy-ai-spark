
import UserProfile from "@/components/auth/UserProfile";
import SEO from "@/components/SEO";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background flex items-center justify-center p-4">
      <SEO
        title="Your Profile - SpeakEasyAI"
        description="Manage your SpeakEasyAI account settings and profile information."
      />
      <UserProfile />
    </div>
  );
}
