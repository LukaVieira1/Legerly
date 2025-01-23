import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ISale } from "@/types/sale";
import { formatCurrency, formatDate, formatPhone } from "@/utils/format";
import {
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PhoneIcon,
  CreditCardIcon,
  ClipboardIcon,
} from "@/components/Icons";

interface SaleListProps {
  sales: ISale[];
}

export function SaleList({ sales }: SaleListProps) {
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <motion.div
          key={sale.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-secondary-200 overflow-hidden"
        >
          <div
            onClick={() =>
              setExpandedSaleId(expandedSaleId === sale.id ? null : sale.id)
            }
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary-50 transition-colors"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full ${
                    sale.isPaid ? "bg-success-500" : "bg-warning-500"
                  }`}
                />
                <div
                  className={`absolute -inset-1 ${
                    sale.isPaid ? "bg-success-500" : "bg-warning-500"
                  } rounded-full animate-ping opacity-20`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  <h3 className="text-secondary-900 font-medium truncate">
                    {sale.client.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <CalendarIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  <p className="text-sm text-secondary-500 truncate">
                    {formatDate(sale.saleDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-secondary-900 font-semibold whitespace-nowrap">
                  {formatCurrency(Number(sale.value))}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                    sale.isPaid
                      ? "bg-success-100 text-success-800"
                      : "bg-warning-100 text-warning-800"
                  }`}
                >
                  {sale.isPaid ? "Pago" : "Pendente"}
                </span>
              </div>
              <motion.div
                animate={{ rotate: expandedSaleId === sale.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDownIcon className="w-5 h-5 text-secondary-400" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expandedSaleId === sale.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-secondary-50 border-t border-secondary-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 flex items-center space-x-2 mb-3">
                          <TagIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span>Detalhes da Venda</span>
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-secondary-200 space-y-2">
                          <div className="text-sm flex flex-col space-y-1">
                            <span className="text-secondary-500">
                              Descrição:
                            </span>
                            <span className="text-secondary-900 break-words">
                              {sale.description}
                            </span>
                          </div>
                          <div className="text-sm flex flex-col space-y-1">
                            <span className="text-secondary-500">
                              Vendedor:
                            </span>
                            <span className="text-secondary-900 break-words">
                              {sale.user.name}
                            </span>
                          </div>
                          <div className="text-sm flex flex-col space-y-1">
                            <span className="text-secondary-500">
                              Vencimento:
                            </span>
                            <span className="text-secondary-900">
                              {formatDate(sale.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 flex items-center space-x-2 mb-3">
                          <UserIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span>Dados do Cliente</span>
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-secondary-200 space-y-2">
                          <div className="text-sm flex flex-col space-y-1">
                            <span className="text-secondary-500 flex items-center space-x-2">
                              <PhoneIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                              <span>Telefone:</span>
                            </span>
                            <span className="text-secondary-900">
                              {formatPhone(sale.client.phone)}
                            </span>
                          </div>
                          <div className="text-sm flex flex-col space-y-1">
                            <span className="text-secondary-500 flex items-center space-x-2">
                              <CreditCardIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                              <span>Débito Total:</span>
                            </span>
                            <span className="text-secondary-900">
                              {formatCurrency(Number(sale.client.debitBalance))}
                            </span>
                          </div>
                          {sale.client.observations && (
                            <div className="text-sm flex flex-col space-y-1">
                              <span className="text-secondary-500 flex items-center space-x-2">
                                <ClipboardIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                                <span>Observações:</span>
                              </span>
                              <span className="text-secondary-900 break-words">
                                {sale.client.observations}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
