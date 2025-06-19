// src/helpers/get-order-status.ts

import t from "@/i18n/ru";

/**
 * Возвращает человекочитаемую строку статуса заказа на русском
 */
export const GetOrderStatus = (status: string): string => {
  const map: Record<string, string> = {
    Pending:                        t.pending,                      // В ожидании подтверждения
    Processing:                     t.processing,                   // В обработке
    Packing:                        t.packing,                      // Упаковка
    CancelledByCustomer:            t.cancelledByCustomer,          // Отменено клиентом
    CancelledDueToUnavailability:   t.cancelledDueToUnavailability, // Отменено из-за отсутствия
    CancelledByAdmin:               t.cancelledByAdmin,             // Отменено администратором
    Shipped:                        t.shipped                       // Доставлено
  };

  return map[status] || t.pending;
};
