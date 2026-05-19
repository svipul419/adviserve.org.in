// src/pages/admin/sections/MenuListSection.tsx

interface Menu {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
}

type Props = {
  menus: Menu[];
  selectedMenu: Menu | null;
  onSelectMenu: (menu: Menu) => void;
};

export function MenuListSection({ menus, selectedMenu, onSelectMenu }: Props) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Menus</h2>
      </div>
      <div className="divide-y">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
 selectedMenu?.id === menu.id ? 'bg-oxblood-primary/10' : ''
 }`}
            onClick={() => onSelectMenu(menu)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{menu.name}</h3>
                <p className="text-sm text-gray-500">{menu.location}</p>
              </div>
              {menu.is_active && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
