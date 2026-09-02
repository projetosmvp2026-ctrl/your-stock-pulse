import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Truck,
  ShoppingCart,
  ClipboardList,
  MapPin,
  Settings,
} from "lucide-react";

export interface PageDef {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const PAGES: PageDef[] = [
  { label: "Painel", path: "/app/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Catálogo", path: "/app/catalog", icon: <Package className="h-4 w-4" /> },
  { label: "Movimentações", path: "/app/movements", icon: <ArrowRightLeft className="h-4 w-4" /> },
  { label: "Fornecedores", path: "/app/suppliers", icon: <Truck className="h-4 w-4" /> },
  { label: "Pedidos de Compra", path: "/app/purchase-orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Solicitações", path: "/app/requests", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Locais", path: "/app/locations", icon: <MapPin className="h-4 w-4" /> },
  { label: "Configurações", path: "/app/settings", icon: <Settings className="h-4 w-4" /> },
];
