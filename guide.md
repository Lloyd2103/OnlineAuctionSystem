# Tài liệu Thiết kế Frontend - Hệ thống Đấu giá Trực tuyến

## 1. Công nghệ sử dụng (Tech Stack)
* **Core & Build Tool:** React + Vite (Tối ưu tốc độ khởi tạo, build nhanh và Hot Module Replacement mượt mà).
* **Styling:** TailwindCSS (Utility-first CSS, hỗ trợ xây dựng giao diện dạng thẻ, lưới, và reponsive nhanh chóng).
* **HTTP Client:** Axios (Tương tác với RESTful API, sử dụng Interceptors để tự động đính kèm token xác thực và xử lý lỗi global).
* **State Management:** Zustand (Quản lý trạng thái toàn cục gọn nhẹ: lưu trữ thông tin user đăng nhập, giỏ hàng, thông báo realtime).
* **Toast Notifications:** Sonner (Hiển thị các cảnh báo quan trọng với hiệu ứng mượt: "Bid thành công", "Bạn đã bị vượt giá", "Giao dịch thất bại").

---

## 2. Cấu trúc Trang (Pages & Routes)

### A. Các trang dành cho Người dùng (Client-side)
* **Trang chủ (Home):** Banner nổi bật, các phiên đấu giá đang "hot", danh mục sản phẩm.
* **Trang Khám phá (Marketplace):** Lưới sản phẩm, bộ lọc (giá, danh mục, thời gian kết thúc), sắp xếp.
* **Phòng Đấu giá Trực tiếp (Live Auction Room - Chi tiết 1 phiên):**
  
  - **Khu vực hiển thị (Hero Section):** Ảnh/Video vật phẩm kích thước vừa, thông tin chi tiết, tình trạng.
  - **Bảng điều khiển Real-time (Live Panel):**
    - Đồng hồ đếm ngược (Countdown Timer) siêu lớn, đổi sang màu đỏ khi sắp hết giờ.
    - Giá hiện tại (Current Highest Bid).
    - Form nhập giá (Input Bid) hoặc các nút giá gợi ý (+10$, +50$).
    - Nút "Mua ngay" (Buy It Now) nếu có.
  - **Lịch sử đấu giá (Bid History):** Cập nhật theo thời gian thực (real-time) danh sách những người vừa trả giá.

### B. Các trang Quản lý (Management Dashboard - Admin/Seller)
* **Quản lý Vật phẩm (Item Management):**
  - Danh sách vật phẩm trong kho (Grid/Table view).
  - Nút Thêm mới/Chỉnh sửa: Mở form nhập tên, mô tả, tình trạng, và khu vực upload nhiều ảnh (Drag & Drop).
  - *Lưu ý: Vật phẩm ở đây đóng vai trò là "hàng hóa", chưa được đưa lên sàn.*

* **Quản lý Cuộc đấu giá (Auction Management):**
  - Bảng danh sách các phiên đấu giá (Đang chờ, Đang diễn ra, Đã kết thúc).
  - Form tạo phiên: Chọn vật phẩm từ kho (Item Management), thiết lập Giá khởi điểm (Starting price), Bước giá (Bid increment), Giá trần (Reserve price), và Thời gian Bắt đầu/Kết thúc.
  - Các nút thao tác: Hủy phiên (nếu chưa có ai bid), Dừng khẩn cấp.

* **Quản lý Giao dịch & Thanh toán (Transaction & Payment Management):**
  - **Bảng Giao dịch (Transactions):** Hiển thị danh sách người thắng cuộc, số tiền chốt đơn, phí nền tảng (nếu có).
  - **Quản lý Thanh toán (Payments):** Trạng thái thanh toán (Chờ thanh toán, Đã thanh toán, Thất bại).
  - Cập nhật trạng thái giao hàng (Đang chuẩn bị, Đã giao, Hoàn tất).


---

## 3. Quản lý Trạng thái & Dữ liệu (State & Data Flow)

* **Zustand Store:**
  - `useAuthStore`: Lưu thông tin User, Token, Role (Admin/User).
  - `useAuctionStore`: Lưu ID phiên đấu giá đang xem, mức giá hiện tại (để đồng bộ nhanh với WebSocket trước khi gọi API).
* **Axios Config:** Cấu hình `axiosInstance` với base URL, thiết lập tự động refresh token khi session hết hạn.
* **Sonner Integration:** Bắt các event từ WebSocket (ví dụ: `onBidSuccess`, `onOutbid`) để bắn thông báo dạng Toast lập tức lên màn hình người dùng ở góc phải.

## 4. Phong cách thiết kế (UI/UX Guidelines)
* **Bố cục (Layout):** Sử dụng dạng thẻ (Card-based) có viền bo góc tròn nhẹ, đổ bóng mờ. Bảng (Table) cho các trang quản lý.
* **Màu sắc:** Giao diện sáng (Light mode) với nền xám nhạt/trắng. Các nút hành động chính (Đặt giá, Thanh toán) dùng màu nổi bật (Xanh dương đậm hoặc Xanh lá). Các cảnh báo đếm ngược dùng màu Đỏ.
* **Tương tác (Interactivity):** Khóa nút "Đặt giá" (Disabled) khi thời gian kết thúc hoặc khi user là người đang giữ giá cao nhất. 