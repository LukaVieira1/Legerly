"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import DashboardLayout from "./layout";

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-500">Bem-vindo, {user?.name}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vendas Hoje</h2>
            <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Total de Clientes
            </h2>
            <p className="text-3xl font-bold text-primary-600">0</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Débitos Pendentes
            </h2>
            <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
