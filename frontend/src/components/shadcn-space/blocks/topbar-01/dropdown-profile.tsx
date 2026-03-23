import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AppWindowMac,
  LogOut,
  Settings,
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  path?: string;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: User, path: '/profile' },
  { label: "My Items", icon: ShoppingCart, path: '/item' },
  { label: "My Auction", icon: AppWindowMac, path: '/auction' },
  { label: "My Transactions", icon: Wallet, path: '/transaction' },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Account Settings", icon: Settings },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: LogOut,
  destructive: true,
};

const itemClass = "px-4 py-2.5 text-base cursor-pointer gap-3";



const ProfileDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuGroup>
          {/* User Info - Đã đổ data thật từ store */}
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage src={user?.userImage || ""} alt={user?.userName || "User"} />
                <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
            </div>

            <div className="flex flex-col">
              <span className="text-foreground text-lg font-semibold">
                {user?.userName || "Anonymous"}
              </span>
              <span className="text-muted-foreground text-sm">
                {user?.userEmail}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Profile Items */}
          {PROFILE_ITEMS.map(({ label, icon: Icon, path }) => (
            <DropdownMenuItem 
              key={label} 
              className={itemClass}
              onClick={() => path && navigate(path)} // Thực hiện navigate ở đây
            >
              <Icon size={20} className="text-foreground" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon, path }) => (
              <DropdownMenuItem 
                key={label} 
                className={itemClass}
                onClick={() => path && navigate(path)}
              >
                <Icon size={20} className="text-foreground" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem variant="destructive" className={itemClass} onClick={handleLogout}>
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
