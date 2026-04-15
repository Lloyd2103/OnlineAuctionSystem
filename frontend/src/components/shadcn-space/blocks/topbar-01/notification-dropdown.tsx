"use client";

import { type ReactNode, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon, Bell, Star, TrendingUp } from "lucide-react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { formatDistanceToNow } from "date-fns";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
};

const getNotificationStyle = (type: string): { icon: LucideIcon; textColor: string; bgColor: string } => {
  switch (type) {
    case "AUCTION_WIN":
      return { icon: Star, textColor: "stroke-yellow-500", bgColor: "bg-yellow-500/10" };
    case "OUTBID":
      return { icon: TrendingUp, textColor: "stroke-red-500", bgColor: "bg-red-500/10" };
    default:
      return { icon: Bell, textColor: "stroke-blue-500", bgColor: "bg-blue-500/10" };
  }
};

const NotificationDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
}: Props) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: { token: accessToken }
    });

    newSocket.on("new_notification", (data) => {
      setNotifications((prev) => [
        {
          id: Math.random().toString(), // Tạm thời dùng random ID
          type: data.type || "INFO",
          title: data.title || "Notification",
          message: data.message || "",
          timestamp: new Date(data.timestamp || new Date()),
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => {
      newSocket.off("new_notification");
      newSocket.disconnect();
    };
  }, [isAuthenticated, accessToken]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="p-0 w-sm rounded-2xl data-open:slide-in-from-top-20! data-closed:slide-out-to-top-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            {/* title */}
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <p className="text-base font-medium text-popover-foreground">
                Notifications
              </p>
              {unreadCount > 0 && (
                <Badge className="h-5 font-normal leading-0">{unreadCount} New</Badge>
              )}
            </DropdownMenuLabel>

            {/* Notifications */}
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => {
                const { icon: Icon, textColor, bgColor } = getNotificationStyle(notif.type);
                return (
                  <DropdownMenuItem
                    key={notif.id}
                    className="mx-1.5 my-1 p-2 flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      // Mark as read when clicked
                      setNotifications((prev) =>
                        prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
                      );
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl", bgColor)}>
                        <Icon size={20} className={cn("size-5", textColor)} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", notif.isRead ? "text-muted-foreground" : "text-popover-foreground")}>
                          {notif.title}
                        </p>
                        <p className="max-w-52 truncate text-sm text-muted-foreground">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                    </p>
                  </DropdownMenuItem>
                );
              })
            )}

            {/* button */}
            <div className="mx-1.5 my-1 p-2">
              <Button className="rounded-xl w-full cursor-pointer hover:bg-primary/80" onClick={() => setNotifications([])}>
                Clear All Notifications
              </Button>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationDropdown;
