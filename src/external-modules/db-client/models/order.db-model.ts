import {
  Order,
  OrderItem,
  OrderSource as OrderSourceType,
  OrderSource as OrderSourceConstant,
  OrderTarget,
  OrderTargetHost as OrderTargetHostConstant,
  OrderTargetHost as OrderTargetHostType,
  ArchivedOrder,
  OrderStatus as OrderStatusConstant,
  OrderStatus as OrderStatusType,
  ArchivedOrderTarget,
  ArchivedOrderItem,
} from '@prisma/client';

export type OrderDbModel = Order;
export type OrderTargetDbModel = OrderTarget;
export type OrderItemDbModel = OrderItem;
export type ArchivedOrderDbModel = ArchivedOrder;
export type ArchivedOrderTargetDbModel = ArchivedOrderTarget;
export type ArchivedOrderItemDbModel = ArchivedOrderItem;

export const ORDER_SOURCE = OrderSourceConstant;
export type ORDER_SOURCE_KEYS = keyof typeof ORDER_SOURCE;
export type OrderSourceStringLiteral = OrderSourceType;

export const ORDER_TARGET_HOST = OrderTargetHostConstant;
export type ORDER_TARGET_HOST_KEYS = keyof typeof ORDER_TARGET_HOST;
export type OrderTargetHostStringLiteral = OrderTargetHostType;

export const ORDER_STATUS = OrderStatusConstant;
export type ORDER_STATUS_KEYS = keyof typeof ORDER_STATUS;
export type OrderStatusStringLiteral = OrderStatusType;
