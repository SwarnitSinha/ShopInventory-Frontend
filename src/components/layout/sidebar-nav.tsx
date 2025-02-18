import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Package, LogOut, DollarSign } from "lucide-react";

const routes = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    roles: ["admin", "staff", "technician"],
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
    roles: ["admin", "staff", "technician"],
  },
  {
    title: "Sales",
    icon: DollarSign,
    href: "/sales",
    roles: ["admin", "staff"],
  },
];

export function SidebarNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <div className="flex h-screen border-r bg-sidebar">
      <div className="flex w-64 flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">Inventory Pro</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes
              .filter((route) => route.roles.includes(user?.role || ""))
              .map((route) => {
                const Icon = route.icon;
                return (
                  <Link key={route.href} href={route.href}>
                    <a
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent",
                        location === route.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {route.title}
                    </a>
                  </Link>
                );
              })}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}