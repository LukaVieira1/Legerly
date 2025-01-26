import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { PaymentIcon, XIcon, DollarIcon } from "@/components/Icons";
import { CurrencyInput } from "./ui/CurrencyInput";
import { Checkbox } from "./ui/Checkbox";
import { formatCurrency } from "@/utils/format";
import { ISale } from "@/types/sale";

const paymentSchema = z.object({
  value: z.string().min(1, "Valor é obrigatório"),
  useRemainingValue: z.boolean().default(false),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: ISale;
  onAddPayment: (value: number, saleId: number) => Promise<void>;
}

export function PaymentModal({
  isOpen,
  onClose,
  sale,
  onAddPayment,
}: PaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remainingValue =
    Number(sale.value) -
    sale.payments.reduce((acc, payment) => acc + Number(payment.value), 0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      value: "",
      useRemainingValue: false,
    },
  });

  const useRemainingValue = watch("useRemainingValue");

  async function onSubmit(data: PaymentFormData) {
    setIsSubmitting(true);
    try {
      const value = useRemainingValue
        ? remainingValue
        : Number(data.value) / 100;
      await onAddPayment(value, sale.id);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Dialog
      as="div"
      className="relative z-10"
      onClose={handleClose}
      open={isOpen}
    >
      <Transition show={isOpen}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                      <PaymentIcon className="w-5 h-5" />
                      <span className="text-lg font-medium">
                        Novo Pagamento
                      </span>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-primary-100 text-sm">
                      Cliente:{" "}
                      <span className="text-white">{sale.client.name}</span>
                    </p>
                    <p className="text-primary-100 text-sm">
                      Descrição:{" "}
                      <span className="text-white">{sale.description}</span>
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 bg-secondary-50"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-secondary-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-600">
                          Valor Restante:
                        </span>
                        <span className="font-medium text-warning-600">
                          {formatCurrency(remainingValue)}
                        </span>
                      </div>
                    </div>

                    <Controller
                      name="value"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          label="Valor do Pagamento"
                          icon={<DollarIcon className="w-4 h-4" />}
                          placeholder="R$ 0,00"
                          error={errors.value}
                          disabled={useRemainingValue}
                          onChange={field.onChange}
                          value={
                            useRemainingValue
                              ? (remainingValue * 100).toString()
                              : field.value
                          }
                        />
                      )}
                    />

                    <Controller
                      name="useRemainingValue"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          label="Usar valor restante"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (e.target.checked) {
                              setValue(
                                "value",
                                (remainingValue * 100).toString()
                              );
                            } else {
                              setValue("value", "");
                            }
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-secondary-200">
                    <motion.button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? "Processando..." : "Confirmar Pagamento"}
                    </motion.button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Transition>
    </Dialog>
  );
}
