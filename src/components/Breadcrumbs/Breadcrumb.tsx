import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumb = ({ breadcrumbs }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {breadcrumbs[breadcrumbs.length - 1].label}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center">
              {breadcrumb.href ? (
                <Link className="font-medium" href={breadcrumb.href}>{breadcrumb.label}
                </Link>
              ) : (
                <span className="font-medium text-primary">{breadcrumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span>&nbsp;/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
