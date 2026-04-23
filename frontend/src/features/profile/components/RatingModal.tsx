import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
    targetUserId: number;
    targetUserName: string;
    onSubmit: (targetId: number, value: number) => Promise<void>;
    onClose: () => void;
}

export function RatingModal({ targetUserId, targetUserName, onSubmit, onClose }: RatingModalProps) {
    const [hovered, setHovered] = useState<number>(0);
    const [selected, setSelected] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selected) return;
        try {
            setSubmitting(true);
            await onSubmit(targetUserId, selected);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    const displayValue = hovered || selected;

    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Rate Seller</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Target user */}
                <p className="text-muted-foreground text-sm mb-6 text-center">
                    How would you rate your experience with{' '}
                    <span className="font-semibold text-foreground">{targetUserName}</span>?
                </p>

                {/* Stars */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setSelected(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                size={40}
                                className={`transition-colors ${
                                    star <= displayValue
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Label */}
                <div className="text-center mb-6 h-6">
                    {displayValue > 0 && (
                        <span className="text-sm font-semibold text-yellow-500">
                            {labels[displayValue]}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border rounded-xl font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selected || submitting}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
}
