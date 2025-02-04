import { formatCurrency } from "@/utils/format";

interface MetricCardProps {
  title: string;
  metrics: number;
  icon: React.ReactNode;
}

export function MetricCard({ title, metrics, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-semibold text-secondary-900">
            {formatCurrency(metrics)}
          </p>
        </div>
      </div>
    </div>
  );
}
