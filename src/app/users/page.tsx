import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserTable from "@/components/Users/UserTable";

const Users = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Users", href: "/users" },
  ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default Users;
