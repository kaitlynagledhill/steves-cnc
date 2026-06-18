export type CartItem = {
  id: string;
  templateId: string;
  name: string;
  imageUrl: string;
  category: string;
  modificationRequest: string;
  woodType: string;
  finish?: string;
  size?: string;
  location?: string;
  engraving?: string;
};

const CART_KEY = "vala_cart";

function notify() {
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const newItem = {
    ...item,
    id: crypto.randomUUID(), 
  };

  cart.push(newItem);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  notify();
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  notify();
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}