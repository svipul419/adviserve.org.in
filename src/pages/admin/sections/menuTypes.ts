// Canonical menu-admin types. Imported by MenuManagement and the
// MenuItemsSection / MenuItemFormSection child components so all four
// stay in sync.

export interface MenuItem {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label: string;
  url: string;
  icon: string | null;
  target: string;
  sort_order: number;
  is_visible: boolean;
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
}

export interface NewMenuItem {
  label: string;
  url: string;
  parent_id: string | null;
  icon: string;
  target: string;
  sort_order: number;
  is_visible: boolean;
}
