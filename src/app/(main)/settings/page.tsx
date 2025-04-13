import { UpdateEmailForm } from "@/features/auth/components/update-email-form";
import { UpdatePasswordForm } from "@/features/auth/components/update-password-form";

const SettingsPage = () => {
  return (
    <div>
      <UpdatePasswordForm />
      <UpdateEmailForm />
    </div>
  );
};

export default SettingsPage;
