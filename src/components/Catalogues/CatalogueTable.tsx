import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import FreeCatalogues from "./FreeCatalogues";
import PaidCatalogues from "./PaidCatalogues";

const CatalogueTable = () => {
    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <Link href="/catalogues/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                    <FaPlus className="text-xl" />
                    Add New Catalogues
                </Link>
                <FreeCatalogues />
                <PaidCatalogues />
            </div>
        </div>
    );
};

export default CatalogueTable;
