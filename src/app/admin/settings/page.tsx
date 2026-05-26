'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  Save,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Truck,
  Bell,
  KeyRound,
  UserCircle,
} from 'lucide-react';
import { settingsService } from '@/services/api/settingsService';
import type { AdminSettingsForm } from '@/types/settings-types';
import { mapFormToSettings, mapSettingsToForm } from '@/utils/settingsMapper';

const emptyForm = mapSettingsToForm({});

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [generalSettings, setGeneralSettings] = useState(emptyForm.general);
  const [emailSettings, setEmailSettings] = useState(emptyForm.email);
  const [shippingSettings, setShippingSettings] = useState(emptyForm.shipping);
  const [paymentSettings, setPaymentSettings] = useState(emptyForm.payment);
  const [notificationSettings, setNotificationSettings] = useState(
    emptyForm.notifications,
  );
  const [taxSettings, setTaxSettings] = useState(emptyForm.tax);
  const [abandonedCartSettings, setAbandonedCartSettings] = useState(
    emptyForm.abandonedCart,
  );
  const [securitySettings, setSecuritySettings] = useState(emptyForm.security);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { settings } = await settingsService.getAll();
      const form = mapSettingsToForm(settings);
      setGeneralSettings(form.general);
      setEmailSettings(form.email);
      setShippingSettings(form.shipping);
      setPaymentSettings(form.payment);
      setNotificationSettings(form.notifications);
      setTaxSettings(form.tax);
      setAbandonedCartSettings(form.abandonedCart);
      setSecuritySettings(form.security);
    } catch {
      setError('Không tải được cài đặt từ server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: Globe },
    { id: 'email', name: 'Cài đặt email', icon: Mail },
    { id: 'shipping', name: 'Vận chuyển', icon: Truck },
    { id: 'tax', name: 'Thuế VAT', icon: CreditCard },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'security', name: 'Bảo mật', icon: Shield },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const form: AdminSettingsForm = {
        general: generalSettings,
        email: emailSettings,
        shipping: shippingSettings,
        payment: paymentSettings,
        notifications: notificationSettings,
        abandonedCart: abandonedCartSettings,
        tax: taxSettings,
        security: securitySettings,
      };
      const payload = mapFormToSettings(form);
      if (
        emailSettings.smtpPassword === '********' ||
        emailSettings.smtpPassword === ''
      ) {
        delete payload['email.smtpPassword'];
      }
      const { settings } = await settingsService.update(payload);
      const updated = mapSettingsToForm(settings);
      setGeneralSettings(updated.general);
      setEmailSettings(updated.email);
      setShippingSettings(updated.shipping);
      setPaymentSettings(updated.payment);
      setNotificationSettings(updated.notifications);
      setTaxSettings(updated.tax);
      setSecuritySettings(updated.security);
      setMessage('Đã lưu cài đặt thành công.');
    } catch {
      setError('Lưu cài đặt thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Đang tải cài đặt...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-600">Quản lý cấu hình lưu trong database (key-value)</p>
      </div>

      {message && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt chung</h3>
              
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tên website
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          siteName: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mô tả website
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteDescription}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          siteDescription: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          contactEmail: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.contactPhone}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          contactPhone: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="mb-1 text-base font-medium text-gray-900">
                  Chat Zalo, Facebook, WhatsApp
                </h4>
                <p className="mb-4 text-sm text-gray-500">
                  Để trống Zalo/WhatsApp sẽ tự tạo link từ số điện thoại liên hệ.
                  Facebook cần link Messenger (ví dụ https://m.me/ten-trang).
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Link Zalo
                    </label>
                    <input
                      type="url"
                      placeholder="https://zalo.me/0914489077 hoặc OA"
                      value={generalSettings.zaloUrl}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          zaloUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Link Facebook Messenger
                    </label>
                    <input
                      type="url"
                      placeholder="https://m.me/ten-trang"
                      value={generalSettings.facebookUrl}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          facebookUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Link WhatsApp
                    </label>
                    <input
                      type="url"
                      placeholder="https://wa.me/84914489077"
                      value={generalSettings.whatsappUrl}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          whatsappUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
              
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt email</h3>
              <p className="text-sm text-gray-500">
                Lưu cấu hình tham chiếu. Gửi mail thực tế vẫn dùng biến môi trường API (.env).
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Host</label>
                  <input type="text" value={emailSettings.smtpHost} onChange={(e) => setEmailSettings((p) => ({ ...p, smtpHost: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Port</label>
                  <input type="text" value={emailSettings.smtpPort} onChange={(e) => setEmailSettings((p) => ({ ...p, smtpPort: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">SMTP User</label>
                  <input type="email" value={emailSettings.smtpUser} onChange={(e) => setEmailSettings((p) => ({ ...p, smtpUser: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Password</label>
                  <input type="password" value={emailSettings.smtpPassword} placeholder="Để trống nếu không đổi" onChange={(e) => setEmailSettings((p) => ({ ...p, smtpPassword: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">From name</label>
                  <input type="text" value={emailSettings.fromName} onChange={(e) => setEmailSettings((p) => ({ ...p, fromName: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">From email</label>
                  <input type="email" value={emailSettings.fromEmail} onChange={(e) => setEmailSettings((p) => ({ ...p, fromEmail: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt vận chuyển</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(
                  [
                    ['freeShippingThreshold', 'Ngưỡng miễn phí vận chuyển (VNĐ)'],
                    ['shippingFee', 'Phí vận chuyển (VNĐ)'],
                    ['deliveryTime', 'Thời gian giao hàng'],
                    ['returnPolicy', 'Chính sách đổi trả'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      value={shippingSettings[key]}
                      onChange={(e) =>
                        setShippingSettings((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Thuế VAT</h3>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Áp dụng VAT trên đơn hàng</span>
                <input
                  type="checkbox"
                  checked={taxSettings.vatEnabled}
                  onChange={(e) =>
                    setTaxSettings((p) => ({
                      ...p,
                      vatEnabled: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-orange-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thuế suất VAT (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxSettings.vatRate}
                  onChange={(e) =>
                    setTaxSettings((p) => ({ ...p, vatRate: e.target.value }))
                  }
                  className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tính trên (tạm tính − giảm giá + phí ship) khi khách đặt hàng.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Cài đặt thanh toán</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Bật phương thức khách thấy ở trang checkout. Cổng trực tuyến cần cấu hình thêm trong{" "}
                  <code className="rounded bg-gray-100 px-1 text-xs">api/.env</code>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Phương thức offline
                </h4>
                {(
                  [
                    ['codEnabled', 'Thanh toán khi nhận hàng (COD)'],
                    ['bankTransferEnabled', 'Chuyển khoản ngân hàng'],
                  ] as const
                ).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <span className="font-medium text-gray-900">{label}</span>
                    <input
                      type="checkbox"
                      checked={paymentSettings[key]}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({ ...p, [key]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Cổng thanh toán trực tuyến
                </h4>

                <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Visa / Mastercard</p>
                      <p className="text-sm text-gray-600">Cổng Stripe — thẻ quốc tế</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentSettings.creditCardEnabled}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({
                          ...p,
                          creditCardEnabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600"
                    />
                  </div>
                  <p className="mt-3 text-xs text-indigo-900/80">
                    Test: <code className="rounded bg-white/80 px-1">STRIPE_MOCK=true</code> — Thật:{" "}
                    <code className="rounded bg-white/80 px-1">STRIPE_SECRET_KEY</code> trong api/.env
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Thẻ ATM nội địa</p>
                      <p className="text-sm text-gray-600">Cổng VNPay — Napas, ATM các ngân hàng VN</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentSettings.atmCardEnabled}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({
                          ...p,
                          atmCardEnabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-emerald-600"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      VNPay TMN Code (Terminal)
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.vnpayTmnCode}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({
                          ...p,
                          vnpayTmnCode: e.target.value,
                        }))
                      }
                      className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="VD: 2QXUI4J4"
                    />
                  </div>
                  <p className="mt-2 text-xs text-emerald-900/80">
                    Test: <code className="rounded bg-white/80 px-1">VNPAY_MOCK=true</code> — Secret:{" "}
                    <code className="rounded bg-white/80 px-1">VNPAY_HASH_SECRET</code> trong api/.env
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">PayPal</p>
                      <p className="text-sm text-gray-600">Ví PayPal / thẻ liên kết PayPal</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentSettings.paypalEnabled}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({
                          ...p,
                          paypalEnabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600"
                    />
                  </div>
                  <p className="mt-3 text-xs text-blue-900/80">
                    Test: <code className="rounded bg-white/80 px-1">PAYPAL_MOCK=true</code> — Thật:{" "}
                    <code className="rounded bg-white/80 px-1">PAYPAL_CLIENT_ID</code>,{" "}
                    <code className="rounded bg-white/80 px-1">PAYPAL_CLIENT_SECRET</code>
                  </p>
                </div>

                <div className="rounded-lg border border-pink-200 bg-pink-50/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Ví MoMo</p>
                      <p className="text-sm text-gray-600">Quét QR / ví MoMo</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentSettings.momoEnabled}
                      onChange={(e) =>
                        setPaymentSettings((p) => ({
                          ...p,
                          momoEnabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-pink-600"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        MoMo Partner Code
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.momoPartnerCode}
                        onChange={(e) =>
                          setPaymentSettings((p) => ({
                            ...p,
                            momoPartnerCode: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        placeholder="MOMOxxxx"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        MoMo Store ID
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.momoStoreId}
                        onChange={(e) =>
                          setPaymentSettings((p) => ({
                            ...p,
                            momoStoreId: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        placeholder="Mặc định = Partner Code"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-pink-900/80">
                    Test: <code className="rounded bg-white/80 px-1">MOMO_MOCK=true</code> — Secret trong api/.env
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.bankAccount}
                    onChange={(e) =>
                      setPaymentSettings((p) => ({ ...p, bankAccount: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.bankName}
                    onChange={(e) =>
                      setPaymentSettings((p) => ({ ...p, bankName: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt thông báo</h3>
              <div className="space-y-4">
                {(
                  [
                    ['newOrderEmail', 'Email đơn hàng mới'],
                    ['orderStatusEmail', 'Email cập nhật trạng thái'],
                    ['lowStockEmail', 'Email hết hàng'],
                    ['newsletterEmail', 'Email newsletter'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{label}</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings[key]}
                      onChange={(e) =>
                        setNotificationSettings((p) => ({
                          ...p,
                          [key]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-medium text-gray-900">
                    Email nhắc giỏ bỏ quên
                  </span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.abandonedCartReminder}
                    onChange={(e) =>
                      setNotificationSettings((p) => ({
                        ...p,
                        abandonedCartReminder: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-orange-600"
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Giỏ bỏ quên
                </h4>
                <label className="mb-1 block text-sm text-gray-600">
                  Coi là bỏ quên sau (giờ không cập nhật giỏ)
                </label>
                <input
                  type="number"
                  min={1}
                  max={720}
                  value={abandonedCartSettings.inactiveHours}
                  onChange={(e) =>
                    setAbandonedCartSettings({
                      inactiveHours: e.target.value,
                    })
                  }
                  className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Áp dụng cho đăng ký, đăng nhập, đổi mật khẩu và đặt lại mật khẩu.
                  Token mới phát hành sau khi lưu sẽ dùng thời hạn mới.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Link
                  href="/admin/users/profile"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle className="h-4 w-4 text-orange-500" />
                  Cập nhật hồ sơ của tôi
                </Link>
                <Link
                  href="/admin/users/change-password"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <KeyRound className="h-4 w-4 text-orange-500" />
                  Đổi mật khẩu của tôi
                </Link>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Đăng ký & đăng nhập
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                    <div>
                      <span className="font-medium text-gray-900">
                        Cho phép đăng ký công khai
                      </span>
                      <p className="text-sm text-gray-500">
                        Khách có thể tạo tài khoản trên website
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.allowPublicRegistration}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          allowPublicRegistration: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                    <div>
                      <span className="font-medium text-gray-900">
                        Chặn tài khoản không hoạt động
                      </span>
                      <p className="text-sm text-gray-500">
                        User bị tắt &quot;Hoạt động&quot; không đăng nhập được
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.blockInactiveUsers}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          blockInactiveUsers: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Chính sách mật khẩu
                </h4>
                <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <span className="font-medium text-gray-900">
                      Yêu cầu mật khẩu mạnh
                    </span>
                    <p className="text-sm text-gray-500">
                      Chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.requireStrongPassword}
                    onChange={(e) =>
                      setSecuritySettings((p) => ({
                        ...p,
                        requireStrongPassword: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-orange-600"
                  />
                </label>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Độ dài tối thiểu (ký tự)
                    </label>
                    <input
                      type="number"
                      min={6}
                      max={32}
                      value={securitySettings.minPasswordLength}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          minPasswordLength: e.target.value,
                        }))
                      }
                      className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Link đặt lại mật khẩu hết hạn sau (giờ)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={securitySettings.passwordResetExpiryHours}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          passwordResetExpiryHours: e.target.value,
                        }))
                      }
                      className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Phiên đăng nhập (JWT)
                </h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Access token (phút)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={1440}
                      value={securitySettings.accessTokenMinutes}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          accessTokenMinutes: e.target.value,
                        }))
                      }
                      className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Hết hạn thì client tự refresh token
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Refresh token (ngày)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={securitySettings.refreshTokenDays}
                      onChange={(e) =>
                        setSecuritySettings((p) => ({
                          ...p,
                          refreshTokenDays: e.target.value,
                        }))
                      }
                      className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
