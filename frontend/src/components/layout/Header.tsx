import { useState } from 'react'
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  Zap,
} from 'lucide-react'
import { useFilterStore } from '@/stores/auctionStore'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router'
import type { AuctionCategory } from '@/types/auction'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'


const categories: AuctionCategory[] = ['All', 'Art', 'Electronics', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports']

export function Header() {
  const { search, setSearch, setCategory } = useFilterStore()
  const { user, accessToken, signOut } = useAuthStore()
  const navigate = useNavigate()
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<AuctionCategory>('All')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isAuthenticated = !!user && !!accessToken

  const handleCategorySelect = (cat: AuctionCategory) => {
    setSelectedSearchCategory(cat)
    setCategory(cat)
    setShowCategoryDropdown(false)
  }

  const handleLogout = async () => {
    await signOut()
    
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U'
    if (user.userName) {
      return user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.userEmail?.[0]?.toUpperCase() || 'U'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Aucto
          </span>
        </a>

        {/* Centered Search Bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="flex w-full items-center rounded-lg border border-border bg-background transition-all focus-within:border-bid focus-within:ring-2 focus-within:ring-bid/20">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-1 border-r border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {selectedSearchCategory}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute left-0 top-full mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="flex w-full items-center px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search auctions..."
                className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          <button className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-live" />
            <span className="sr-only">Notifications</span>
          </button>

          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2.5 text-muted-foreground hover:bg-accent md:hidden transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </button>
          
          {/* Auth Section - Desktop */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:flex items-center gap-2 rounded-lg border border-border py-2.5 px-4 hover:bg-accent transition-colors">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.userName || user?.userEmail}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border py-2.5 px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

    </header>
  )
}
