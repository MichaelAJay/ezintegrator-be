import {
  Menu,
  MenuItem,
  MenuSource as MenuSourceType,
  MenuSource as MenuSourceConstant,
} from '@prisma/client';

export type MenuDbModel = Menu;
export type MenuItemDbModel = MenuItem;

export const MENU_SOURCE = MenuSourceConstant;
export const MenuSourceStringLiterla = MenuSourceType;
