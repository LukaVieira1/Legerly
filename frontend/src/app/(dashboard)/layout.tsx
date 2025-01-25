"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UsersIcon, LogOutIcon } from "@/components/Icons";
import { ClientProvider } from "@/providers/ClientProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, signOut } = useAuthContext();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Clientes", href: "/clients", icon: UsersIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <ClientProvider>
        <nav className="bg-white shadow-sm border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-primary-600">Ledgerly</h1>
                <div className="hidden sm:flex sm:space-x-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "text-primary-600 bg-primary-50"
                            : "text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                        }`}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          }
        >
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </Suspense>
      </ClientProvider>
    </div>
  );
}
