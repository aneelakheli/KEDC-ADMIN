import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";
import AboutTable from "@/components/AboutUs/AboutTable";

const About = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "About", href: "/about" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AboutTable/>    
      </div>
    </DefaultLayout>
  );
};

export default About;
