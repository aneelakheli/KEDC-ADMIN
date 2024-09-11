import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileForm from "@/components/Profile/ProfileForm";

export const metadata: Metadata = {
  title: "KEDC",
  description:
    "Kantipur Education Development Council",
};

const Profile = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Profile" },
  ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <ProfileForm />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
