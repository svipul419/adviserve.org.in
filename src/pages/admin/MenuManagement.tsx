import { useEffect, useState } from 'react';
import { adminDb } from '../../lib/adminDb';
import toast from 'react-hot-toast';
import { MenuListSection } from './sections/MenuListSection';
import { MenuItemFormSection } from './sections/MenuItemFormSection';
import { MenuItemsSection } from './sections/MenuItemsSection';
import type { MenuItem, Menu } from './sections/menuTypes';

interface NewItem {
  label: string;
  url: string;
  parent_id: string | null;
  icon: string;
  target: string;
  sort_order: number;
  is_visible: boolean;
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<NewItem>({
    label: '',
    url: '',
    parent_id: null,
    icon: '',
    target: '_self',
    sort_order: 0,
    is_visible: true,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      fetchMenuItems(selectedMenu.id);
    }
  }, [selectedMenu]);

  const fetchMenus = async () => {
    const { data, error } = await adminDb
      .from('navigation_menus')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching menus:', error);
      return;
    }

    setMenus(data || []);
    if (data && data.length > 0 && !selectedMenu) {
      setSelectedMenu(data[0]);
    }
  };

  const fetchMenuItems = async (menuId: string) => {
    const { data, error } = await adminDb
      .from('menu_items')
      .select('*')
      .eq('menu_id', menuId)
      .order('sort_order');

    if (error) {
      console.error('Error fetching menu items:', error);
      return;
    }

    setMenuItems(data || []);
  };

  const toggleItemVisibility = async (item: MenuItem) => {
    const { error } = await adminDb
      .from('menu_items')
      .update({ is_visible: !item.is_visible })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update visibility');
      return;
    }

    toast.success(item.is_visible ? 'Item hidden' : 'Item visible');
    if (selectedMenu) {
      fetchMenuItems(selectedMenu.id);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('menu_items')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } else {
      toast.success('Menu item deleted');
      if (selectedMenu) {
        fetchMenuItems(selectedMenu.id);
      }
    }
    setDeleteId(null);
  };

  const saveItem = async (item: MenuItem) => {
    const { error } = await adminDb
      .from('menu_items')
      .update({
        label: item.label,
        url: item.url,
        parent_id: item.parent_id || null,
        icon: item.icon || null,
        target: item.target,
        sort_order: item.sort_order,
        is_visible: item.is_visible,
      })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to save menu item');
      return;
    }

    toast.success('Menu item saved');
    setEditingItem(null);
    if (selectedMenu) {
      fetchMenuItems(selectedMenu.id);
    }
  };

  const addItem = async () => {
    if (!selectedMenu || !newItem.label || !newItem.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = await adminDb
      .from('menu_items')
      .insert({
        menu_id: selectedMenu.id,
        label: newItem.label,
        url: newItem.url,
        parent_id: newItem.parent_id || null,
        icon: newItem.icon || null,
        target: newItem.target,
        sort_order: newItem.sort_order,
        is_visible: newItem.is_visible,
      });

    if (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
      return;
    }

    toast.success('Menu item added');
    setIsAddingItem(false);
    setNewItem({
      label: '',
      url: '',
      parent_id: null,
      icon: '',
      target: '_self',
      sort_order: 0,
      is_visible: true,
    });
    fetchMenuItems(selectedMenu.id);
  };

  const moveItem = async (item: MenuItem, direction: 'up' | 'down') => {
    const currentIndex = menuItems.findIndex((i) => i.id === item.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === menuItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapItem = menuItems[newIndex];

    const updates = [
      adminDb
        .from('menu_items')
        .update({ sort_order: swapItem.sort_order })
        .eq('id', item.id),
      adminDb
        .from('menu_items')
        .update({ sort_order: item.sort_order })
        .eq('id', swapItem.id),
    ];

    const results = await Promise.all(updates);
    if (results.some((r) => r.error)) {
      console.error('Error reordering items');
      toast.error('Failed to reorder items');
      return;
    }

    toast.success('Item reordered');
    if (selectedMenu) {
      fetchMenuItems(selectedMenu.id);
    }
  };

  const getParentOptions = () => menuItems.filter((item) => !item.parent_id);

  const organizeMenuItems = () => {
    const organized: { parent: MenuItem; children: MenuItem[] }[] = [];
    const topLevel = menuItems.filter((item) => !item.parent_id);
    topLevel.forEach((parent) => {
      const children = menuItems.filter((item) => item.parent_id === parent.id);
      organized.push({ parent, children });
    });
    return organized;
  };

  const organizedItems = organizeMenuItems();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Menu Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MenuListSection
            menus={menus}
            selectedMenu={selectedMenu}
            onSelectMenu={setSelectedMenu}
          />
        </div>

        <div className="lg:col-span-3">
          {isAddingItem && (
            <div className="mb-4">
              <MenuItemFormSection
                newItem={newItem}
                setNewItem={setNewItem}
                parentOptions={getParentOptions()}
                onAdd={addItem}
                onCancel={() => setIsAddingItem(false)}
              />
            </div>
          )}
          <MenuItemsSection
            selectedMenu={selectedMenu}
            menuItems={menuItems}
            organizedItems={organizedItems}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            deleteId={deleteId}
            setDeleteId={setDeleteId}
            onAddItemClick={() => setIsAddingItem(true)}
            onToggleVisibility={toggleItemVisibility}
            onSaveItem={saveItem}
            onMoveItem={moveItem}
            onConfirmDelete={confirmDelete}
          />
        </div>
      </div>
    </div>
  );
}
