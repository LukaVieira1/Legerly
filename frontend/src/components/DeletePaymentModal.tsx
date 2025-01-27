import { Dialog, DialogPanel } from "@headlessui/react";
import { motion } from "framer-motion";
import { TrashIcon, XIcon } from "@/components/Icons";
import { IPayment } from "@/types/payment";
import { formatCurrency, formatDate } from "@/utils/format";

interface DeletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: IPayment;
  onConfirm: () => Promise<void>;
}

export function DeletePaymentModal({
  isOpen,
  onClose,
  payment,
  onConfirm,
}: DeletePaymentModalProps) {
  return (
    <Dialog as="div" className="relative z-10" onClose={onClose} open={isOpen}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-danger-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <TrashIcon className="w-5 h-5" />
                  <span className="text-lg font-medium">Excluir Pagamento</span>
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
                  Tem certeza que deseja excluir este pagamento?
                </p>
                <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600">
                      {formatDate(payment.payDate)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(Number(payment.value))}
                    </span>
                  </div>
                </div>
              </div>

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
        </div>
      </div>
    </Dialog>
  );
}
