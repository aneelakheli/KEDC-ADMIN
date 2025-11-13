'use client'
import { useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import FreeCatalogues from "./FreeCatalogues";
import PaidCatalogues from "./PaidCatalogues";
import { useAuth } from "@/context/AuthContext";

type TabType = 'free' | 'premium';

const CatalogueTable = () => {
    const auth = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('free');

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                {
                    auth?.user && ['Admin'].includes(auth.user.role) && (
                        <Link href="/catalogues/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                            <FaPlus className="text-xl" />
                            Add New Resources
                        </Link>
                    )
                }

                {/* Tabs Navigation */}
                <div className="mb-6 border-b border-stroke dark:border-strokedark">
                    <nav className="flex gap-2" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('free')}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === 'free'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            Free Resources
                        </button>
                        <button
                            onClick={() => setActiveTab('premium')}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === 'premium'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            Premium Resources
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'free' && <FreeCatalogues />}
                    {activeTab === 'premium' && <PaidCatalogues />}
                </div>
            </div>
        </div>
    );
};

export default CatalogueTable;
