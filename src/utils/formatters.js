export const formatCRC = (valor) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

export const formatDateTime = (valor) => {
  if (!valor) return "-";

  return new Date(valor).toLocaleString("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatDate = (valor) => {
  if (!valor) return "-";

  return new Date(valor).toLocaleDateString("es-CR", {
    dateStyle: "medium",
  });
};

export const getSaleStatusClass = (estado) => {
  const classes = {
    pagada: "paid",
    parcial: "partial",
    pendiente: "pending",
    anulada: "cancelled",
  };

  return classes[estado?.toLowerCase()] || "";
};

export const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.mensaje) return data.mensaje;
  if (data?.title) return data.title;
  return fallback;
};
