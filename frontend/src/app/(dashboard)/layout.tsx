"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ChartIcon,
} from "@/components/Icons";
import { ClientProvider } from "@/providers/ClientProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, signOut } = useAuthContext();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Clientes", href: "/clients", icon: UsersIcon },
    { name: "Métricas", href: "/metrics", icon: ChartIcon },
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
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Ledgerly</h1>
                <div className="hidden sm:flex sm:ml-8 sm:space-x-4">
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
                  className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sair
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                >
                  {isMobileMenuOpen ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden border-t border-secondary-200"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive
                            ? "text-primary-600 bg-primary-50"
                            : "text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                  >
                    <div className="flex items-center">
                      <LogOutIcon className="mr-3 h-5 w-5" />
                      Sair
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
