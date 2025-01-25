import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClientContext } from "@/providers/ClientProvider";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { motion } from "framer-motion";
import {
  UserIcon,
  CalendarIcon,
  DollarCircleIcon,
  ClipboardIcon,
  XIcon,
  DollarIcon,
} from "@/components/Icons";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "./ui/Select";
import { Checkbox } from "./ui/Checkbox";
import { ISaleForm } from "@/types/sale";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { toast } from "react-toastify";

const saleSchema = z.object({
  value: z.string().min(1, "Valor é obrigatório"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatório"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  isPaid: z.boolean().default(false),
  clientId: z.string().min(1, "Cliente é obrigatório"),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (sale: ISaleForm) => void;
}

export function SaleModal({ isOpen, onClose, onAddSale }: SaleModalProps) {
  const { clients } = useClientContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      value: "",
      dueDate: "",
      description: "",
      isPaid: false,
      clientId: "",
    },
  });

  async function onSubmit(data: SaleFormData) {
    setIsSubmitting(true);
    try {
      await onAddSale({
        clientId: Number(data.clientId),
        value: Number(data.value) / 100,
        description: data.description,
        dueDate: data.dueDate,
        isPaid: data.isPaid,
      });
      toast.success("Venda adicionada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar venda");
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
      <Transition
        appear
        show={isOpen}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </Transition>

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
            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-medium text-white flex items-center space-x-2">
                    <DollarCircleIcon />
                    <span>Nova Venda</span>
                  </DialogTitle>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-primary-100">
                    Preencha os dados da nova venda
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6 bg-secondary-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Cliente"
                        placeholder="Selecione um cliente"
                        icon={<UserIcon className="w-4 h-4" />}
                        error={errors.clientId}
                        options={clients.map((client) => ({
                          value: client.id.toString(),
                          label: client.name,
                        }))}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="value"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        label="Valor"
                        icon={<DollarIcon className="w-4 h-4" />}
                        placeholder="R$ 0,00"
                        error={errors.value}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />

                  <Input
                    label="Data de Vencimento"
                    icon={<CalendarIcon className="w-4 h-4" />}
                    type="date"
                    error={errors.dueDate}
                    {...register("dueDate")}
                  />

                  <div className="flex items-end">
                    <Controller
                      name="isPaid"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          label="Venda já está paga"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextArea
                      label="Descrição"
                      icon={<ClipboardIcon className="w-4 h-4" />}
                      placeholder="Descreva a venda"
                      error={errors.description}
                      rows={3}
                      {...register("description")}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
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
                    {isSubmitting ? "Criando..." : "Criar Venda"}
                  </motion.button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  );
}
