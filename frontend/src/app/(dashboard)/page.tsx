// Next
"use client";
import { useEffect, useState } from "react";

// Providers
import { useAuthContext } from "@/providers/AuthProvider";

// Types
import { IStoreMetrics } from "@/types/store";
import { ISale, ISaleFilters, ISaleForm } from "@/types/sale";

// Services
import { getStoreMetrics } from "@/services/store";
import { createSale, deleteSale, getSaleById, getSales } from "@/services/sale";
import { createPayment, deletePayment } from "@/services/payment";

// Components
import { DollarCircleIcon, ExclamationCircleIcon } from "@/components/Icons";
import DashboardLayout from "./layout";
import { MetricCard } from "@/components/MetricCard";
import { MetricSkeleton } from "@/components/skeletons/MetricSkeleton";
import { SaleList } from "@/components/SaleList";
import { SaleSkeleton } from "@/components/skeletons/SaleSkeleton";
import { SaleModal } from "@/components/SaleModal";
import { toast } from "react-toastify";
import { SaleFilters } from "@/components/SaleFilters";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/Spinner";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = useState<IStoreMetrics | null>(null);
  const [sales, setSales] = useState<ISale[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 10,
  });
  const [filters, setFilters] = useState<ISaleFilters>({
    search: "",
    isPaid: "",
    startDate: "",
    endDate: "",
  });

  const fetchInitialData = async () => {
    setInitialLoading(true);
    try {
      const [metricsData, salesData] = await Promise.all([
        getStoreMetrics(),
        getSales({ page: 1, limit: pagination.perPage }),
      ]);
      setMetrics(metricsData);
      setSales(salesData.sales);
      setPagination(salesData.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados iniciais");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchFilteredSales = async (page = 1, currentFilters = filters) => {
    setFilterLoading(true);
    try {
      const response = await getSales({
        page,
        limit: pagination.perPage,
        ...currentFilters,
      });
      setSales(response.sales);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao filtrar vendas");
    } finally {
      setFilterLoading(false);
    }
  };

  const handleFilter = (newFilters: ISaleFilters) => {
    const currentPosition = window.scrollY;
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setTimeout(() => window.scrollTo(0, currentPosition), 0);
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialLoading) {
        fetchFilteredSales(1);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, initialLoading]);

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

  const handleDeleteSale = async (saleId: number) => {
    try {
      await deleteSale(saleId);
      toast.success("Venda excluída com sucesso");
      setSales(
        (prevSales) => prevSales?.filter((sale) => sale.id !== saleId) || []
      );
    } catch (error) {
      if (error instanceof Error) {
        if ("status" in error && error.status === 403) {
          toast.error("Somente proprietários ou gerentes podem excluir vendas");
        } else {
          toast.error("Erro ao excluir venda");
        }
      } else {
        console.error("Erro desconhecido:", error);
        toast.error("Erro ao excluir venda");
      }
    }
  };

  const handleDeletePayment = async (paymentId: number, saleId: number) => {
    try {
      await deletePayment(paymentId);
      toast.success("Pagamento excluído com sucesso");
      const sale = await getSaleById(saleId);
      setSales(
        (prevSales) =>
          prevSales?.map((oldSale) =>
            oldSale.id === saleId ? sale : oldSale
          ) || []
      );
    } catch (error) {
      if (error instanceof Error) {
        if ("status" in error && error.status === 403) {
          toast.error(
            "Somente proprietários ou gerentes podem excluir pagamentos"
          );
        } else {
          toast.error("Erro ao excluir pagamento");
        }
      } else {
        console.error("Erro desconhecido:", error);
        toast.error("Erro ao excluir pagamento");
      }
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
          {initialLoading ? (
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

          <SaleFilters onFilter={handleFilter} />

          <div className="mt-4 min-h-[200px] md:min-h-[500px] relative">
            {initialLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((n) => (
                  <SaleSkeleton key={n} />
                ))}
              </div>
            ) : filterLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Spinner />
              </div>
            ) : sales.length > 0 ? (
              <SaleList
                sales={sales}
                onAddPayment={handleAddPayment}
                onDeleteSale={handleDeleteSale}
                onDeletePayment={handleDeletePayment}
              />
            ) : (
              <p className="text-center text-secondary-500 py-8">
                Nenhuma venda encontrada
              </p>
            )}
          </div>

          {sales.length > 0 && !initialLoading && (
            <div className="mt-2">
              <Pagination
                total={pagination.total}
                perPage={pagination.perPage}
                currentPage={pagination.currentPage}
                onPageChange={(page) => fetchFilteredSales(page)}
              />
            </div>
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
