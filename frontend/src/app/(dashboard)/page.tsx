// Next
"use client";
import { useEffect, useState } from "react";

// Providers
import { useAuthContext } from "@/providers/AuthProvider";

// Types
import { IStoreMetrics } from "@/types/store";

// Services
import { getStoreMetrics } from "@/services/store";

// Components
import { DollarCircleIcon, ExclamationCircleIcon } from "@/components/Icons";
import DashboardLayout from "./layout";
import { MetricCard } from "@/components/MetricCard";
import { MetricSkeleton } from "@/components/skeletons/MetricSkeleton";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = useState<IStoreMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMetrics = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const metrics = await getStoreMetrics();
        setMetrics(metrics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
          <h1 className="text-2xl font-medium text-secondary-900">
            Olá,{" "}
            <span className="font-bold text-primary-600">{user?.name}</span>
          </h1>
          <p className="mt-1 text-secondary-500">
            Bem-vindo ao painel de controle da {user?.store.name}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                metrics={Number(metrics?.totalPayments)}
                title="Total de Vendas"
                icon={<DollarCircleIcon />}
              />
              <MetricCard
                metrics={Number(metrics?.totalDebits)}
                title="Débitos Pendentes"
                icon={<ExclamationCircleIcon />}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
