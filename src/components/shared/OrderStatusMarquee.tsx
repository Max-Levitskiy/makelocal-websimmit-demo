"use client";

import { useOrderStatuses } from "@/lib/orders";
import type { OrderStatus, OrderStatusType } from "@/types/api";

/**
 * Format order status for display
 */
function formatStatus(status: OrderStatusType): string {
  const statusMap: Record<OrderStatusType, string> = {
    draft: "Draft",
    design_request: "Design Request",
    pending: "Pending",
    offered: "Offered",
    matched: "Matched",
    in_production: "In Production",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    reviewing: "Reviewing",
    changes_suggested: "Changes Suggested",
    completed: "Completed ✓",
    pending_payment: "Pending Payment",
  };

  return statusMap[status] || status;
}

/**
 * Format order item for marquee display
 */
function formatOrderItem(order: OrderStatus): string {
  console.log("order", order);
  const productTitle = order.products?.title ?? "Product";
  const quantity = order.quantity > 1 ? ` (×${order.quantity})` : "";
  const status = formatStatus(order.status);

  return `${productTitle}${quantity} order: ${status}`;
}

export function OrderStatusMarquee() {
  const { orders, loading } = useOrderStatuses(60000); // Refresh every minute

  if (loading) {
    return (
      <div className="inline-block whitespace-nowrap animate-marquee text-slate-700 dark:text-slate-300">
        <span className="px-4">Loading orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    // Repeat empty state message to fill the line
    const emptyMessage = (
      <>
        <span className="px-4">Here will be your orders</span>
        <span className="text-primary px-4">•</span>
        <span className="px-4">
          Add products to cart and checkout to see your orders here
        </span>
        <span className="text-primary px-4">•</span>
      </>
    );

    // Create array of unique keys for repeated empty messages
    const emptyMessageKeys = Array.from(
      { length: 6 },
      (_, i) => `empty-msg-${i}-${Date.now()}`,
    );

    return (
      <div className="inline-block whitespace-nowrap animate-marquee text-slate-700 dark:text-slate-300">
        {emptyMessageKeys.map((key) => (
          <span key={key}>{emptyMessage}</span>
        ))}
      </div>
    );
  }

  // Create marquee content by repeating orders to ensure line is filled
  // Repeat at least 6 times to ensure smooth scrolling even with short text
  const repeatCount = Math.max(6, Math.ceil(20 / orders.length));
  const marqueeItems = Array.from({ length: repeatCount }, () => orders).flat();

  return (
    <div className="inline-block whitespace-nowrap animate-marquee text-slate-700 dark:text-slate-300">
      {marqueeItems.map((order, index) => (
        <span key={`${order.id}-${index}`}>
          <span className="px-4">{formatOrderItem(order)}</span>
          <span className="text-primary px-4">•</span>
        </span>
      ))}
    </div>
  );
}
