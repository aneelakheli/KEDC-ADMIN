import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/components/ProtectedRoutes";

export const metadata: Metadata = {
  title:
    "KEDC Dashboard",
  description: "This is Next.js Home for KEDC Admin Dashboard",
};

export default function Home() {
  return (
    <>
     <ProtectedRoute roles={['Admin','Author','Teacher']}>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
     </ProtectedRoute>
    </>
  );
}
