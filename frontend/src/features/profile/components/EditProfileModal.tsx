import { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import type { User } from '@/features/auth/types/user';

interface EditProfileModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (data: { userName: string; userPhone: string; userAddress: string; userImage?: File }) => Promise<void>;
}

export function EditProfileModal({ user, isOpen, onClose, onUpdate }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        userName: user.userName || '',
        userPhone: user.userPhone || '',
        userAddress: user.userAddress || '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.userImage || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                userName: user.userName || '',
                userPhone: user.userPhone || '',
                userAddress: user.userAddress || '',
            });
            setPreviewUrl(user.userImage || null);
            setSelectedFile(null);
        }
    }, [isOpen, user]);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onUpdate({
                ...formData,
                userImage: selectedFile || undefined
            });
            onClose();
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <img
                                src={previewUrl || '/default-avatar.png'}
                                className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 bg-muted"
                                alt="Avatar Preview"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-primary font-medium hover:underline"
                        >
                            Change Photo
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email (Read-only)</label>
                            <input
                                type="email"
                                disabled
                                className="w-full px-4 py-2 bg-muted border rounded-xl cursor-not-allowed opacity-70"
                                value={user.userEmail}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.userPhone}
                                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <textarea
                                className="w-full px-4 py-2 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                                value={formData.userAddress}
                                onChange={(e) => setFormData({ ...formData, userAddress: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2 border rounded-xl font-medium hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
