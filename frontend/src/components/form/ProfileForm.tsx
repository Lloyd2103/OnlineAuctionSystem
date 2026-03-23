import { MapPin, Calendar, Star, Package, Gavel, Phone } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';


export function UserProfilePage() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const { userName, userEmail, userPhone, userAddress, userStatus, userImage, createdAt } = user || {};
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(userImage || null);
    const [loading, setLoading] = useState(false);

    // 1. Xử lý khi người dùng chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Giải phóng URL cũ nếu có để tránh tràn bộ nhớ
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // 2. Gửi ảnh lên Backend
    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            const response = await authService.updateProfile({
                userName: userName || '',
                userEmail: userEmail || '',
                userPhone: userPhone || '',
                userAddress: userAddress || '',
                userStatus: userStatus || '',
                userImage: selectedFile
            });

            if (response) {
                setUser(response); 
                toast.success("Cập nhật ảnh thành công!");
                setSelectedFile(null);
                // Sau khi upload thành công, previewUrl sẽ được cập nhật từ response qua userImage
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Có lỗi xảy ra khi tải ảnh lên.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm hủy chọn ảnh
    const handleCancel = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(userImage || null);
    };

    return (
        <div className="min-h-screen bg-muted/30">
        {/* 1. Header Section (Cover & Avatar) */}
        <div className="bg-card border-b">
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-bid/20">
                <div className="absolute -bottom-16 left-4 md:left-8">
                    <div className="relative group">
                        {/* Hiển thị ảnh: Ưu tiên ảnh preview, nếu không có thì dùng ảnh từ database */}
                        <img 
                            src={previewUrl || '/default-avatar.png'} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card bg-muted object-cover"
                            alt="Avatar"
                        />
                        
                        {/* Nút bấm để chọn file */}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <span className="text-white text-xs font-medium">Thay đổi ảnh</span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                    {/* Nút xác nhận upload (Chỉ hiện khi đã chọn ảnh mới) */}
                    {selectedFile && (
                        <div className="mt-2 flex gap-2">
                            <button 
                                onClick={handleUpload}
                                disabled={loading}
                                className="text-xs bg-success text-black px-3 py-1 rounded shadow-sm"
                            >   
                                Xác Nhận

                            </button>
                            <button 
                                onClick={handleCancel}
                                className="text-xs bg-destructive text-black px-3 py-1 rounded shadow-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                <h1 className="text-2xl font-bold">{userName}</h1>
                <p className="text-muted-foreground">{userEmail}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {userAddress}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {userPhone}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Joined {createdAt}</span>
                </div>
                </div>
                <div className="flex gap-2">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
                    Follow
                </button>
                <button className="px-6 py-2 border rounded-lg font-medium hover:bg-muted">
                    Message
                </button>
                </div>
            </div>
            </div>
        </div>

        {/* 2. Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar: Info & Stats */}
            <aside className="lg:col-span-4 space-y-6">
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
                <h2 className="font-bold text-lg mb-4">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                Specializing in vintage watches and 20th-century modern art. I have been collecting for over 10 years and only list verified authentic items.
                </p>
                <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Seller Rating</span>
                    <span className="font-bold">4.9/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Gavel size={16} /> Total Auctions</span>
                    <span className="font-bold">124</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Package size={16} /> Items Sold</span>
                    <span className="font-bold">89</span>
                </div>
                </div>
            </div>
            </aside>

            {/* Feed: Auctions List */}
            <main className="lg:col-span-8">
            <div className="flex items-center gap-8 border-b mb-6 overflow-x-auto">
                <button className="pb-4 border-b-2 border-primary font-bold text-primary whitespace-nowrap">Active Auctions</button>
                <button className="pb-4 text-muted-foreground hover:text-foreground whitespace-nowrap">Past Sales</button>
                <button className="pb-4 text-muted-foreground hover:text-foreground whitespace-nowrap">Reviews</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* List out the auctions of this specific user */}
                {/* <AuctionCard type="buyer" data={...} /> */}
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed lg:col-span-2">
                <Gavel size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Currently no active auctions from this user.</p>
                </div>
            </div>
            </main>
        </div>
        </div>
    );
    }