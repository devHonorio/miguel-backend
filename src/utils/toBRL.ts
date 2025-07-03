export const toBRL = (price: number) =>
  Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(
    price,
  )
