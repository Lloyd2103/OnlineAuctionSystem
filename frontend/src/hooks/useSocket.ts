    import { useEffect, useRef, useState } from 'react';
    import { io, Socket } from 'socket.io-client';
    import { useAuthStore } from '@/features/auth/stores/authStore';

    export const useSocket = (auctionId: string | undefined, enabled: boolean = false) => {
        const [socket, setSocket] = useState<Socket | null>(null);
        const socketRef = useRef<Socket | null>(null);
        const [isConnected, setIsConnected] = useState(false);

        const { isAuthenticated, accessToken, refresh } = useAuthStore();

        // Dùng ref để lấy token mới nhất cho socket mà không gây reconnect khi token thay đổi
        const tokenRef = useRef(accessToken);
        useEffect(() => {
            tokenRef.current = accessToken;
        }, [accessToken]);

        useEffect(() => {
            // Chỉ kết nối khi enabled, thực sự có auctionId và đã đăng nhập
            if (!enabled || !auctionId || !isAuthenticated || !tokenRef.current) return;

            const URL = import.meta.env.VITE_SOCKET_URL;

            // 2. Khởi tạo socket
            const newSocket = io(URL, {
                auth: { token: tokenRef.current },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 3
            });

            socketRef.current = newSocket;
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log(`Connected to auction: ${auctionId}`);
                setIsConnected(true);
                newSocket.emit('join_auction', auctionId);
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            newSocket.on('connect_error', (err) => {
                console.error("Socket error:", err.message);
                if (err.message.includes("jwt expired") || err.message.includes("Authentication error")) {
                    // Tự động refresh token khi phát hiện lỗi auth
                    refresh();
                }
            });

            // 3. Cleanup
            return () => {
                if (newSocket) {
                    newSocket.emit('leave_auction', auctionId);
                    newSocket.disconnect();
                    socketRef.current = null;
                    setSocket(null);
                    setIsConnected(false);
                }
            };
        }, [auctionId, isAuthenticated, enabled, refresh]);

        // 4. Cập nhật token định kỳ (sau 15p) - Sử dụng Ref sẽ không bị lỗi ESLint
        useEffect(() => {
            if (socketRef.current && accessToken) {
                // Thay đổi thuộc tính của ref hoàn toàn hợp lệ trong React
                socketRef.current.auth = { token: accessToken };
            }
        }, [accessToken]);

        const placeBidReq = (bidAmount: number) => {
            if (socket?.connected && auctionId) {
                socket.emit('place_bid', { auctionId, bidAmount });
            } else {
                console.error('Lỗi: Socket chưa kết nối hoặc thiếu auctionId.');
            }
        };

        return {
            socket,
            isConnected,
            placeBid: placeBidReq
        };
    };