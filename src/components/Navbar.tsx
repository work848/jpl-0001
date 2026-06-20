import { NavLink } from 'react-router-dom';
import { BookOpen, PenTool, Layers, Upload } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { to: '/', label: '动词变形', icon: PenTool },
    { to: '/adjective', label: '形容词变形', icon: BookOpen },
    { to: '/practice', label: '词库练习', icon: Layers },
    { to: '/import', label: '批量导入', icon: Upload },
  ];

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">あ</span>
            <h1 className="text-white text-lg font-bold">日语动词形容词助手</h1>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-400 text-white shadow-md'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
