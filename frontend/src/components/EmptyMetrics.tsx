import { ChartIcon } from "./Icons";

export function EmptyMetrics() {
  return (
    <div className="bg-white p-8 rounded-lg border border-secondary-200 text-center">
      <div className="flex justify-center">
        <div className="bg-secondary-50 p-3 rounded-full">
          <ChartIcon className="w-8 h-8 text-secondary-400" />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-secondary-900">
        Nenhuma métrica disponível
      </h3>
      <p className="mt-2 text-sm text-secondary-500">
        Não há dados para o período selecionado. Tente ajustar os filtros ou
        adicione algumas vendas.
      </p>
    </div>
  );
}
