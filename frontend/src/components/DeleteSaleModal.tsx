import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { TrashIcon, XIcon, PaymentIcon } from "@/components/Icons";
import { ISale } from "@/types/sale";
import { formatCurrency, formatDate } from "@/utils/format";

interface DeleteSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: ISale;
  onConfirm: () => Promise<void>;
}

export function DeleteSaleModal({
  isOpen,
  onClose,
  sale,
  onConfirm,
}: DeleteSaleModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="bg-danger-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                      <TrashIcon className="w-5 h-5" />
                      <span className="text-lg font-medium">Excluir Venda</span>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-secondary-900">
                    <p className="font-medium">
                      Tem certeza que deseja excluir esta venda?
                    </p>
                    <p className="text-sm text-secondary-600 mt-1">
                      Esta ação não poderá ser desfeita e todos os pagamentos
                      serão excluídos.
                    </p>
                  </div>

                  {sale.payments.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-secondary-900">
                        Pagamentos que serão excluídos:
                      </p>
                      <div className="bg-secondary-50 rounded-lg p-3 space-y-2">
                        {sale.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center space-x-2">
                              <PaymentIcon className="w-4 h-4 text-primary-500" />
                              <span>{formatDate(payment.payDate)}</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrency(Number(payment.value))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-danger-600 hover:bg-danger-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Confirmar Exclusão
                    </motion.button>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
