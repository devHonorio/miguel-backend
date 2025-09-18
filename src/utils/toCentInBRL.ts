export const toCentsInBRL = (cents: number) => {
  const real = cents / 100;
  return Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(real);
};
