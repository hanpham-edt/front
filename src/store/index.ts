import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistReducer, persistStore, type PersistedState } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import { getCartLineKey, getEffectiveProductPrice } from "@/lib/cart-line";
import { getProductPrimaryImageUrl } from "@/lib/product-images";
import type { CartItem } from "@/types/cart-types";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

function migrateCartItems(items: unknown[]): CartItem[] {
  return items
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const product = item.product as CartItem["product"] | undefined;
      const productId = String(item.productId ?? product?.id ?? "");
      if (!productId || !product) return null;
      const variant = (item.variant as CartItem["variant"]) ?? null;
      const variantId =
        (item.variantId as string | null | undefined) ?? variant?.id ?? null;
      const lineKey =
        typeof item.lineKey === "string"
          ? item.lineKey
          : getCartLineKey(productId, variantId);
      const unitPrice =
        typeof item.unitPrice === "number"
          ? item.unitPrice
          : getEffectiveProductPrice(product, variant);
      const primaryImage = getProductPrimaryImageUrl(product);
      const normalizedProduct = primaryImage
        ? { ...product, imageUrl: primaryImage }
        : product;

      return {
        lineKey,
        productId,
        variantId,
        variantName:
          (item.variantName as string | null | undefined) ??
          variant?.name ??
          null,
        product: normalizedProduct,
        variant,
        unitPrice,
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    })
    .filter((item): item is CartItem => item !== null);
}

const persistConfig = {
  key: "root",
  version: 3,
  storage,
  whitelist: ["auth", "cart"],
  migrate: (state: PersistedState): Promise<PersistedState> => {
    const root = state as { cart?: { items?: unknown[] } } | undefined;
    if (!root?.cart?.items?.length) {
      return Promise.resolve(state);
    }
    const items = migrateCartItems(root.cart.items);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );
    return Promise.resolve({
      ...root,
      cart: { items, totalItems, totalPrice },
    } as unknown as PersistedState);
  },
};
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type IRootState = ReturnType<typeof store.getState>;
