export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone
      .replace(/(.{0})(\d)/, "$1($2")
      .replace(/(.{3})(\d)/, "$1) $2")
      .replace(/(.{6})(\d)/, "$1 $2")
      .replace(/(.{11})(\d)/, "$1 - $2");
  } else {
    return phone
      .replace(/(.{0})(\d)/, "$1($2")
      .replace(/(.{3})(\d)/, "$1) $2")
      .replace(/(.{9})(\d)/, "$1 - $2");
  }
}
