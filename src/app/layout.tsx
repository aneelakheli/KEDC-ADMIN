"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import Loader from "@/components/common/Loader";
import Providers from "@/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ? <Loader /> : children}
            </div>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            draggable={false}/>
        </Providers>
      </body>
    </html>
  );
}
