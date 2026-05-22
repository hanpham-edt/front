'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Save,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Truck,
  Bell,
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

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt thanh toán</h3>
              <div className="space-y-4">
                {(
                  [
                    ['codEnabled', 'Thanh toán khi nhận hàng (COD)'],
                    ['bankTransferEnabled', 'Chuyển khoản ngân hàng'],
                    ['creditCardEnabled', 'Thẻ tín dụng'],
                    ['paypalEnabled', 'PayPal'],
                    ['momoEnabled', 'Momo'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
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
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                Đổi mật khẩu admin tại menu tài khoản. Cài đặt bảo mật nâng cao sẽ bổ sung sau.
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
