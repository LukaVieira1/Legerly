// Next
"use client";
import { useEffect, useState } from "react";

// Providers
import { useAuthContext } from "@/providers/AuthProvider";

// Types
import { IStoreMetrics } from "@/types/store";
import { ISale, ISaleForm } from "@/types/sale";

// Services
import { getStoreMetrics } from "@/services/store";
import { createSale, getSaleById, getSales } from "@/services/sale";
import { createPayment } from "@/services/payment";

// Components
import { DollarCircleIcon, ExclamationCircleIcon } from "@/components/Icons";
import DashboardLayout from "./layout";
import { MetricCard } from "@/components/MetricCard";
import { MetricSkeleton } from "@/components/skeletons/MetricSkeleton";
import { SaleList } from "@/components/SaleList";
import { SaleSkeleton } from "@/components/skeletons/SaleSkeleton";
import { SaleModal } from "@/components/SaleModal";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = useState<IStoreMetrics | null>(null);
  const [sales, setSales] = useState<ISale[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const [metrics, sales] = await Promise.all([
          getStoreMetrics(),
          getSales(),
        ]);
        setMetrics(metrics);
        setSales(sales);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getStoreMetrics();
        setMetrics(metrics);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar as métricas");
      }
    };
    fetchMetrics();
  }, [sales]);

  const handleAddPayment = async (value: number, saleId: number) => {
    try {
      await createPayment({
        saleId,
        value,
      });
      toast.success("Pagamento registrado com sucesso!");
      const sale = await getSaleById(saleId);
      setSales(
        (prevSales) =>
          prevSales?.map((oldSale) =>
            oldSale.id === saleId ? sale : oldSale
          ) || []
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar pagamento");
    }
  };

  const handleAddSale = async (sale: ISaleForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newSale = await createSale(sale);
      setSales([newSale, ...(sales || [])]);
      setIsModalOpen(false);
      return newSale;
    } catch (error) {
      return error;
    } finally {
    }
  };

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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-secondary-900">
              Vendas Recentes
            </h2>
            <div className="flex justify-end border-secondary-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Nova Venda
              </button>
            </div>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((n) => (
                <SaleSkeleton key={n} />
              ))}
            </div>
          ) : sales && sales.length !== 0 ? (
            <SaleList sales={sales} onAddPayment={handleAddPayment} />
          ) : (
            <p className="text-center text-secondary-500 py-8">
              Nenhuma venda encontrada
            </p>
          )}
        </div>
      </div>
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSale={handleAddSale}
      />
    </DashboardLayout>
  );
}
