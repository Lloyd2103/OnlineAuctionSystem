import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageDropdown from "@/components/shadcn-space/blocks/topbar-01/dropdown-language";
import ProfileDropdown from "@/components/shadcn-space/blocks/topbar-01/dropdown-profile";
import { BellRing, Globe, User, Zap } from "lucide-react";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar-01/notification-dropdown";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from 'react-router'
import SearchBar from "@/components/shadcn-space/blocks/topbar-01/search-bar";


const Header = () => {
    const { user, accessToken } = useAuthStore()
    const navigate = useNavigate()
    const isAuthenticated = !!user && !!accessToken

    const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "U";
    return (
        <div className="flex flex-1 flex-col">
            <header className="bg-card sticky top-0 z-50 border-b">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
                <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
                        <Zap className="h-6 w-7 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        Aucto
                    </span>
                </a>
                </div>

                <div className="flex items-center gap-2.5">
                <SearchBar />
                </div>

                <div className="flex items-center gap-2.5">
                <NotificationDropdown
                    defaultOpen={false}
                    align="center"
                    trigger={
                    <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
                        <BellRing className="size-4" />
                    </div>
                    }
                />
                <LanguageDropdown
                    trigger={
                    <div
                        id="language-dropdown-trigger"
                        className="rounded-full hover:bg-accent/80 cursor-pointer p-2"
                    >
                        <Globe size={16} />
                    </div>
                    }
                />
                {isAuthenticated ? (
                    <ProfileDropdown
                    trigger={
                        <Avatar className="size-8 cursor-pointer border border-border hover:opacity-80 transition-opacity">
                            {/* AvatarImage sẽ ưu tiên hiển thị nếu src có giá trị hợp lệ */}
                            <AvatarImage 
                                src={user?.userImage} 
                                alt={user?.userName} 
                                className="object-cover"
                            />
                            {/* AvatarFallback chỉ hiện khi ảnh đang load hoặc bị lỗi */}
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitial(user?.userName || "")}
                            </AvatarFallback>
                        </Avatar>
                    }
                    />
                ) : (
                <div 
                    className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1"
                    onClick={() => navigate('/signin')}
                    >
                        <User className="h-4 w-4" />
                </div>
            )}
                </div>
            </div>
            </header>

        </div>
    );
    };

export default Header;