import type {
  AdminSettingsForm,
  PublicPaymentOptions,
  PublicSiteInfo,
  SettingsMap,
} from "@/types/settings-types";

const DEFAULT_FORM: AdminSettingsForm = {
  general: {
    siteName: "Yến Sào Premium",
    siteDescription: "Chuyên cung cấp yến sào chất lượng cao",
    contactEmail: "info@yensaopremium.com",
    contactPhone: "+84 123 456 789",
    address: "123 Đường ABC, Quận 1, TP.HCM, Việt Nam",
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromName: "Yến Sào Premium",
    fromEmail: "noreply@yensaopremium.com",
  },
  shipping: {
    freeShippingThreshold: "2000000",
    shippingFee: "50000",
    deliveryTime: "1-3 ngày",
    returnPolicy: "7 ngày",
  },
  payment: {
    codEnabled: true,
    bankTransferEnabled: true,
    creditCardEnabled: true,
    paypalEnabled: false,
    momoEnabled: false,
    momoPartnerCode: "",
    momoStoreId: "",
    bankAccount: "1234567890",
    bankName: "Vietcombank",
  },
  notifications: {
    newOrderEmail: true,
    orderStatusEmail: true,
    lowStockEmail: true,
    newsletterEmail: true,
    abandonedCartReminder: true,
  },
  abandonedCart: {
    inactiveHours: "24",
  },
  tax: {
    vatEnabled: true,
    vatRate: "8",
  },
};

function boolFromString(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined) return fallback;
  return v === "true";
}

export function mapSettingsToForm(settings: SettingsMap): AdminSettingsForm {
  const d = DEFAULT_FORM;
  return {
    general: {
      siteName: settings["general.siteName"] ?? d.general.siteName,
      siteDescription:
        settings["general.siteDescription"] ?? d.general.siteDescription,
      contactEmail: settings["general.contactEmail"] ?? d.general.contactEmail,
      contactPhone: settings["general.contactPhone"] ?? d.general.contactPhone,
      address: settings["general.address"] ?? d.general.address,
    },
    email: {
      smtpHost: settings["email.smtpHost"] ?? d.email.smtpHost,
      smtpPort: settings["email.smtpPort"] ?? d.email.smtpPort,
      smtpUser: settings["email.smtpUser"] ?? d.email.smtpUser,
      smtpPassword: settings["email.smtpPassword"] ?? "",
      fromName: settings["email.fromName"] ?? d.email.fromName,
      fromEmail: settings["email.fromEmail"] ?? d.email.fromEmail,
    },
    shipping: {
      freeShippingThreshold:
        settings["shipping.freeShippingThreshold"] ??
        d.shipping.freeShippingThreshold,
      shippingFee: settings["shipping.shippingFee"] ?? d.shipping.shippingFee,
      deliveryTime: settings["shipping.deliveryTime"] ?? d.shipping.deliveryTime,
      returnPolicy: settings["shipping.returnPolicy"] ?? d.shipping.returnPolicy,
    },
    payment: {
      codEnabled: boolFromString(settings["payment.codEnabled"], d.payment.codEnabled),
      bankTransferEnabled: boolFromString(
        settings["payment.bankTransferEnabled"],
        d.payment.bankTransferEnabled,
      ),
      creditCardEnabled: boolFromString(
        settings["payment.creditCardEnabled"],
        d.payment.creditCardEnabled,
      ),
      paypalEnabled: boolFromString(
        settings["payment.paypalEnabled"],
        d.payment.paypalEnabled,
      ),
      momoEnabled: boolFromString(
        settings["payment.momoEnabled"],
        d.payment.momoEnabled,
      ),
      momoPartnerCode:
        settings["payment.momoPartnerCode"] ?? d.payment.momoPartnerCode,
      momoStoreId: settings["payment.momoStoreId"] ?? d.payment.momoStoreId,
      bankAccount: settings["payment.bankAccount"] ?? d.payment.bankAccount,
      bankName: settings["payment.bankName"] ?? d.payment.bankName,
    },
    notifications: {
      newOrderEmail: boolFromString(
        settings["notifications.newOrderEmail"],
        d.notifications.newOrderEmail,
      ),
      orderStatusEmail: boolFromString(
        settings["notifications.orderStatusEmail"],
        d.notifications.orderStatusEmail,
      ),
      lowStockEmail: boolFromString(
        settings["notifications.lowStockEmail"],
        d.notifications.lowStockEmail,
      ),
      newsletterEmail: boolFromString(
        settings["notifications.newsletterEmail"],
        d.notifications.newsletterEmail,
      ),
      abandonedCartReminder: boolFromString(
        settings["notifications.abandonedCartReminder"],
        d.notifications.abandonedCartReminder,
      ),
    },
    abandonedCart: {
      inactiveHours:
        settings["abandonedCart.inactiveHours"] ??
        d.abandonedCart.inactiveHours,
    },
    tax: {
      vatEnabled: boolFromString(settings["tax.vatEnabled"], d.tax.vatEnabled),
      vatRate: settings["tax.vatRate"] ?? d.tax.vatRate,
    },
  };
}

const DEFAULT_PUBLIC: PublicSiteInfo = {
  siteName: DEFAULT_FORM.general.siteName,
  siteDescription: DEFAULT_FORM.general.siteDescription,
  contactEmail: DEFAULT_FORM.general.contactEmail,
  contactPhone: DEFAULT_FORM.general.contactPhone,
  address: DEFAULT_FORM.general.address,
  deliveryTime: DEFAULT_FORM.shipping.deliveryTime,
  returnPolicy: DEFAULT_FORM.shipping.returnPolicy,
  shippingFee: Number(DEFAULT_FORM.shipping.shippingFee) || 50_000,
  freeShippingThreshold:
    Number(DEFAULT_FORM.shipping.freeShippingThreshold) || 2_000_000,
  vatEnabled: DEFAULT_FORM.tax.vatEnabled,
  vatRate: Number(DEFAULT_FORM.tax.vatRate) || 8,
};

export function mapPublicSettingsToPaymentOptions(
  settings: SettingsMap,
): PublicPaymentOptions {
  const d = DEFAULT_FORM.payment;
  return {
    codEnabled: boolFromString(settings["payment.codEnabled"], d.codEnabled),
    bankTransferEnabled: boolFromString(
      settings["payment.bankTransferEnabled"],
      d.bankTransferEnabled,
    ),
    creditCardEnabled: boolFromString(
      settings["payment.creditCardEnabled"],
      d.creditCardEnabled,
    ),
    momoEnabled: boolFromString(settings["payment.momoEnabled"], d.momoEnabled),
    bankAccount: settings["payment.bankAccount"] ?? d.bankAccount,
    bankName: settings["payment.bankName"] ?? d.bankName,
  };
}

export function mapPublicSettingsToSiteInfo(
  settings: SettingsMap,
): PublicSiteInfo {
  return {
    siteName: settings["general.siteName"] ?? DEFAULT_PUBLIC.siteName,
    siteDescription:
      settings["general.siteDescription"] ?? DEFAULT_PUBLIC.siteDescription,
    contactEmail:
      settings["general.contactEmail"] ?? DEFAULT_PUBLIC.contactEmail,
    contactPhone:
      settings["general.contactPhone"] ?? DEFAULT_PUBLIC.contactPhone,
    address: settings["general.address"] ?? DEFAULT_PUBLIC.address,
    deliveryTime:
      settings["shipping.deliveryTime"] ?? DEFAULT_PUBLIC.deliveryTime,
    returnPolicy:
      settings["shipping.returnPolicy"] ?? DEFAULT_PUBLIC.returnPolicy,
    shippingFee:
      Number(settings["shipping.shippingFee"]) || DEFAULT_PUBLIC.shippingFee,
    freeShippingThreshold:
      Number(settings["shipping.freeShippingThreshold"]) ||
      DEFAULT_PUBLIC.freeShippingThreshold,
    vatEnabled: boolFromString(
      settings["tax.vatEnabled"],
      DEFAULT_PUBLIC.vatEnabled,
    ),
    vatRate: Number(settings["tax.vatRate"]) || DEFAULT_PUBLIC.vatRate,
  };
}

export function mapFormToSettings(form: AdminSettingsForm): SettingsMap {
  return {
    "general.siteName": form.general.siteName,
    "general.siteDescription": form.general.siteDescription,
    "general.contactEmail": form.general.contactEmail,
    "general.contactPhone": form.general.contactPhone,
    "general.address": form.general.address,
    "email.smtpHost": form.email.smtpHost,
    "email.smtpPort": form.email.smtpPort,
    "email.smtpUser": form.email.smtpUser,
    "email.smtpPassword": form.email.smtpPassword,
    "email.fromName": form.email.fromName,
    "email.fromEmail": form.email.fromEmail,
    "shipping.freeShippingThreshold": form.shipping.freeShippingThreshold,
    "shipping.shippingFee": form.shipping.shippingFee,
    "shipping.deliveryTime": form.shipping.deliveryTime,
    "shipping.returnPolicy": form.shipping.returnPolicy,
    "payment.codEnabled": String(form.payment.codEnabled),
    "payment.bankTransferEnabled": String(form.payment.bankTransferEnabled),
    "payment.creditCardEnabled": String(form.payment.creditCardEnabled),
    "payment.paypalEnabled": String(form.payment.paypalEnabled),
    "payment.momoEnabled": String(form.payment.momoEnabled),
    "payment.momoPartnerCode": form.payment.momoPartnerCode.trim(),
    "payment.momoStoreId": form.payment.momoStoreId.trim(),
    "payment.bankAccount": form.payment.bankAccount,
    "payment.bankName": form.payment.bankName,
    "notifications.newOrderEmail": String(form.notifications.newOrderEmail),
    "notifications.orderStatusEmail": String(
      form.notifications.orderStatusEmail,
    ),
    "notifications.lowStockEmail": String(form.notifications.lowStockEmail),
    "notifications.newsletterEmail": String(form.notifications.newsletterEmail),
    "notifications.abandonedCartReminder": String(
      form.notifications.abandonedCartReminder,
    ),
    "abandonedCart.inactiveHours": form.abandonedCart.inactiveHours,
    "tax.vatEnabled": String(form.tax.vatEnabled),
    "tax.vatRate": form.tax.vatRate,
  };
}
