export type SettingsMap = Record<string, string>;

export interface SettingsResponse {
  settings: SettingsMap;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
}

export interface ShippingSettings {
  freeShippingThreshold: string;
  shippingFee: string;
  deliveryTime: string;
  returnPolicy: string;
}

export interface PaymentSettings {
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  creditCardEnabled: boolean;
  paypalEnabled: boolean;
  momoEnabled: boolean;
  momoPartnerCode: string;
  momoStoreId: string;
  bankAccount: string;
  bankName: string;
}

export interface NotificationSettings {
  newOrderEmail: boolean;
  orderStatusEmail: boolean;
  lowStockEmail: boolean;
  newsletterEmail: boolean;
  abandonedCartReminder: boolean;
}

export interface AbandonedCartSettings {
  inactiveHours: string;
}

export interface TaxSettings {
  vatEnabled: boolean;
  vatRate: string;
}

export interface AdminSettingsForm {
  general: GeneralSettings;
  email: EmailSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
  notifications: NotificationSettings;
  abandonedCart: AbandonedCartSettings;
  tax: TaxSettings;
}

/** Phương thức thanh toán từ GET /settings/public */
export interface PublicPaymentOptions {
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  creditCardEnabled: boolean;
  momoEnabled: boolean;
  bankAccount: string;
  bankName: string;
}

/** Thông tin storefront từ GET /settings/public */
export interface PublicSiteInfo {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  deliveryTime: string;
  returnPolicy: string;
  shippingFee: number;
  freeShippingThreshold: number;
  vatEnabled: boolean;
  vatRate: number;
}
