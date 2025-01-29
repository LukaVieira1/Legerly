import {
  FiDollarSign,
  FiAlertCircle,
  FiChevronDown,
  FiUser,
  FiCalendar,
  FiTag,
  FiPhone,
  FiCreditCard,
  FiClipboard,
  FiLogOut,
  FiHome,
  FiUsers,
  FiEdit2,
  FiTrash,
  FiPlus,
  FiMinus,
  FiMessageSquare,
  FiX,
  FiSearch,
  FiCreditCard as FiPayment,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart,
  FiChevronUp,
} from "react-icons/fi";

interface IconProps {
  className?: string;
}

export function DollarCircleIcon({}: IconProps) {
  return (
    <div className="bg-primary-50 p-3 rounded-full">
      <FiDollarSign className="w-6 h-6 text-primary-600" />
    </div>
  );
}

export function ExclamationCircleIcon({}: IconProps) {
  return (
    <div className="bg-warning-50 p-3 rounded-full">
      <FiAlertCircle className="w-6 h-6 text-warning-600" />
    </div>
  );
}

export function ChevronDownIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiChevronDown className={className} />;
}

export function UserIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiUser className={className} />;
}

export function CalendarIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiCalendar className={className} />;
}

export function TagIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiTag className={className} />;
}

export function PhoneIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiPhone className={className} />;
}

export function CreditCardIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiCreditCard className={className} />;
}

export function ClipboardIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiClipboard className={className} />;
}

export function LogOutIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiLogOut className={className} />;
}

export function HomeIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiHome className={className} />;
}

export function UsersIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiUsers className={className} />;
}

export function EditIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiEdit2 className={className} />;
}

export function TrashIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiTrash className={className} />;
}

export function PlusIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiPlus className={className} />;
}

export function MinusIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiMinus className={className} />;
}

export function MessageSquareIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiMessageSquare className={className} />;
}

export function XIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiX className={className} />;
}

export function DollarIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiDollarSign className={className} />;
}

export function SearchIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiSearch className={className} />;
}

export function PaymentIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiPayment className={className} />;
}

export function MenuIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiMenu className={className} />;
}

export function ChevronLeftIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiChevronLeft className={className} />;
}

export function ChevronRightIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiChevronRight className={className} />;
}

export function ChartIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiBarChart className={className} />;
}

export function ChevronUpIcon({ className = "w-6 h-6" }: IconProps) {
  return <FiChevronUp className={className} />;
}
