export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  } catch {
    return {};
  }
};

export const getStoredBusiness = () => getStoredUser()?.negocio || {};

export const getBusinessIdentity = () => {
  const negocio = getStoredBusiness();
  const nombre = negocio?.nombre || negocio?.Nombre || "Mi Emprendimiento";
  const logoUrl = negocio?.logoUrl || negocio?.LogoUrl || "";
  const iniciales = nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("") || "ME";

  return { negocio, nombre, logoUrl, iniciales };
};
