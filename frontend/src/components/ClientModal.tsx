// Next
import { Fragment } from "react";

// Forms
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks
import { useClients } from "@/hooks/useClients";

// Types
import { IClient } from "@/types/client";

// Components
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  MessageSquareIcon,
  XIcon,
} from "@/components/Icons";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  observations: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: IClient | null;
}

export function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const { createClient, updateClient } = useClients();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          ...client,
          birthDate: client.birthDate
            ? new Date(client.birthDate).toISOString().split("T")[0]
            : undefined,
          observations: client.observations || undefined,
        }
      : {},
  });

  async function onSubmit(data: ClientFormData) {
    try {
      if (client) {
        await updateClient(client.id, data);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await createClient(data);
        toast.success("Cliente criado com sucesso!");
      }
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar cliente: " + error);
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
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              <div className="relative bg-primary-600 p-6">
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-white flex items-center space-x-2"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>{client ? "Editar Cliente" : "Novo Cliente"}</span>
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
                    {client
                      ? "Atualize os dados do cliente"
                      : "Preencha os dados do novo cliente"}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6 bg-secondary-50"
              >
                <div className="space-y-4">
                  <Input
                    label="Nome"
                    icon={<UserIcon className="w-4 h-4" />}
                    placeholder="Digite o nome do cliente"
                    error={errors.name}
                    {...register("name")}
                  />

                  <Input
                    label="Telefone"
                    icon={<PhoneIcon className="w-4 h-4" />}
                    placeholder="(00) 00000-0000"
                    error={errors.phone}
                    {...register("phone")}
                  />

                  <Input
                    label="Data de Nascimento"
                    icon={<CalendarIcon className="w-4 h-4" />}
                    type="date"
                    {...register("birthDate")}
                  />

                  <TextArea
                    label="Observações"
                    icon={<MessageSquareIcon className="w-4 h-4" />}
                    placeholder="Adicione observações sobre o cliente"
                    rows={3}
                    {...register("observations")}
                  />
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
                    {isSubmitting
                      ? "Salvando..."
                      : client
                      ? "Atualizar"
                      : "Criar"}
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
