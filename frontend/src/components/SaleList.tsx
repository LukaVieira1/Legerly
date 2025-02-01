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
  PaymentIcon,
  TrashIcon,
} from "@/components/Icons";
import { PaymentModal } from "./PaymentModal";
import { DeleteSaleModal } from "./DeleteSaleModal";
import { DeletePaymentModal } from "./DeletePaymentModal";
import { IPayment } from "@/types/payment";

interface SaleListProps {
  sales: ISale[];
  onAddPayment: (value: number, saleId: number) => Promise<void>;
  onDeleteSale: (saleId: number) => Promise<void>;
  onDeletePayment: (paymentId: number, saleId: number) => Promise<void>;
}

export function SaleList({
  sales,
  onAddPayment,
  onDeleteSale,
  onDeletePayment,
}: SaleListProps) {
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [selectedSale, setSelectedSale] = useState<ISale | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    payment: IPayment;
    sale: ISale;
  } | null>(null);
  const [isDeletePaymentModalOpen, setIsDeletePaymentModalOpen] =
    useState(false);

  return (
    <>
      <div className="space-y-4">
        {sales.map((sale, index) => (
          <motion.div
            key={`${sale.id}-${index}`}
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
                                {formatCurrency(
                                  Number(sale.client.debitBalance)
                                )}
                              </span>
                            </div>

                            <div className="text-sm flex flex-col space-y-1">
                              <span className="text-secondary-500 flex items-center space-x-2">
                                <ClipboardIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                                <span>Observações:</span>
                              </span>
                              <span className="text-secondary-900 break-words">
                                {sale.client.observations ||
                                  "Nenhuma observação"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 flex items-center space-x-2 mb-3">
                          <PaymentIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span>Histórico de Pagamentos</span>
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-secondary-200">
                          {sale.payments.length > 0 ? (
                            <div className="space-y-3">
                              {sale.payments.map((payment) => (
                                <div
                                  key={payment.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <PaymentIcon className="w-4 h-4 text-primary-500" />
                                    <span>{formatDate(payment.payDate)}</span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="font-medium">
                                      {formatCurrency(Number(payment.value))}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setSelectedPayment({ payment, sale });
                                        setIsDeletePaymentModalOpen(true);
                                      }}
                                      className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-full transition-colors"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-secondary-500 text-center py-2">
                              Nenhum pagamento registrado
                            </div>
                          )}

                          {!sale.isPaid && (
                            <div className="mt-3 pt-3 border-t border-secondary-200">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-secondary-600">
                                  Valor Restante:
                                </span>
                                <span className="font-medium text-warning-600">
                                  {formatCurrency(
                                    Number(sale.value) -
                                      sale.payments.reduce(
                                        (acc, payment) =>
                                          acc + Number(payment.value),
                                        0
                                      )
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-2 px-4 py-2">
              {!sale.isPaid && (
                <button
                  onClick={() => {
                    setSelectedSale(sale);
                    setIsPaymentModalOpen(true);
                  }}
                  className="flex items-center px-3 py-1.5 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
                >
                  <PaymentIcon className="w-4 h-4 mr-1.5" />
                  Pagar
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedSale(sale);
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center px-3 py-1.5 text-sm text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100"
              >
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Excluir
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSale && (
        <>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
            onAddPayment={onAddPayment}
          />
          <DeleteSaleModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
            onConfirm={() => onDeleteSale(selectedSale.id)}
          />
        </>
      )}
      {selectedPayment && (
        <DeletePaymentModal
          isOpen={isDeletePaymentModalOpen}
          onClose={() => {
            setIsDeletePaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment.payment}
          onConfirm={async () => {
            await onDeletePayment(
              selectedPayment.payment.id,
              selectedPayment.sale.id
            );
          }}
        />
      )}
    </>
  );
}
