# Online Auction System: Frontend & Figma Design Guide

Dưới đây là tài liệu chi tiết về Cấu trúc Dữ liệu (Models) và các API Endpoints (Routes) từ Backend. Tài liệu này nhằm hỗ trợ đội ngũ UI/UX Designer (Figma) và Frontend Developer nắm rõ các trường dữ liệu cần thiết để thiết kế giao diện (form, danh sách, chi tiết, v.v.) và ghép nối API chuẩn xác.

---

## 1. Cấu trúc Dữ liệu (Models)

### 1.1. User (Người dùng)
Dữ liệu hiển thị ở màn hình: Đăng ký, Đăng nhập, Trang cá nhân, Danh sách đánh giá.
- `userName` (String): Tên hiển thị người dùng.
- `userEmail` (String): Email (duy nhất).
- `userPhone` (String): Số điện thoại (duy nhất).
- `userAddress` (String): Địa chỉ liên hệ.
- `userStatus` (String): Trạng thái tài khoản (Mặc định: `active`).
- `identifiedStatus` (String): Trạng thái định danh (Mặc định: `unidentified`).
- `userImage` (File/Image URL): Ảnh đại diện.
- `walletBalance` (Decimal): Số dư ví (hiển thị ở màn quản lý ví).
- `ratingScore` (Decimal): Điểm đánh giá trung bình.
- `ratingCount` (Integer): Số lượt đánh giá.

### 1.2. Item (Vật phẩm đấu giá)
Dữ liệu hiển thị ở màn hình: Thêm vật phẩm, Quản lý vật phẩm cá nhân, Chi tiết vật phẩm.
- `itemName` (String): Tên vật phẩm.
- `itemDescription` (Text): Mô tả chi tiết vật phẩm.
- `itemAddress` (String): Nơi lưu trữ/giao nhận vật phẩm.
- `itemStatus` (String): Trạng thái (Mặc định: `available`).
- `itemImage` (File/Image URL): Hình ảnh vật phẩm.
- `price` (Decimal): Giá cơ sở / định giá vật phẩm.
- `category` (String): Danh mục vật phẩm (Ví dụ: Đồ cổ, Trang sức, Điện tử...).
- `attributes` (JSONB): Các thuộc tính động tuỳ theo danh mục (Ví dụ nếu là Đồ cổ: Niên đại, Chất liệu).

### 1.3. Auction (Phiên đấu giá)
Dữ liệu hiển thị ở màn hình: Tạo phiên đấu giá, Danh sách đấu giá đang diễn ra/sắp tới, Chi tiết phiên đấu giá.
- `itemId` (Integer): Liên kết với Vật phẩm.
- `title` (String): Tiêu đề phiên đấu giá.
- `description` (String): Mô tả phiên đấu giá.
- `startTime` (DateTime): Thời gian bắt đầu.
- `endTime` (DateTime): Thời gian kết thúc.
- `auctionStatus` (String): Trạng thái phiên (Mặc định: `UPCOMING`).
- `startingPrice` (Decimal): Giá khởi điểm.
- `incrementPrice` (Decimal): Bước giá (số tiền tối thiểu mỗi lần tăng giá).
- `instantBuyPrice` (Decimal, Tùy chọn): Giá mua đứt.
- `mandatoryDeposit` (Decimal): Tiền cọc bắt buộc để tham gia đấu giá.

### 1.4. Bid (Lượt ra giá)
Dữ liệu hiển thị ở màn hình: Lịch sử ra giá ở chi tiết Auction.
- `auctionId` (Integer): ID của phiên đấu giá.
- `bidderId` (Integer): ID của người ra giá.
- `bidAmount` (Decimal): Số tiền ra giá.
- `isWinningBid` (Boolean): Có phải mức giá chiến thắng không (Mặc định: `false`).

### 1.5. Transaction (Giao dịch Ví / Thanh toán)
Dữ liệu hiển thị ở màn hình: Lịch sử ví, Nạp/Rút tiền, Thanh toán đấu giá.
- `type` (Enum): `DEPOSIT` (Nạp), `WITHDRAW` (Rút), `AUCTION_PAYMENT` (Thanh toán hđ), `REFUND` (Hoàn tiền cọc).
- `amount` (Decimal): Số tiền giao dịch.
- `transactionStatus` (Enum): `PENDING` (Đang XL), `COMPLETED` (Hoàn thành), `FAILED` (Thất bại).
- `paymentMethod` (Enum): `CREDIT_CARD`, `PAYPAL`, `BANK_TRANSFER`.
- `paymentStatus` (Enum): Trạng thái thanh toán của bên thứ 3 (Pending/Completed/Failed).

---

## 2. Các API Endpoints Để Thiết Kế Luồng

*(Lưu ý: Các thiết kế trên Figma cần có màn hình cho các chức năng tương ứng với các nhóm API dưới đây)*

### 🚀 A. Luồng Đăng nhập / Xác thực (`/api/auth`)
- `POST /signup`: Màn hình Đăng ký tài khoản.
- `POST /signin`: Màn hình Đăng nhập.
- `POST /signout`: Nút Đăng xuất.
- `POST /refresh`: (Ngầm) Tự động làm mới token.

### 👤 B. Luồng Người dùng & Cá nhân (`/api/users`)
- `GET /profile`: Màn hình Thông tin cá nhân.
- `PUT /profile`: Form Cập nhật thông tin cá nhân (Có upload Ảnh `image`).
- `GET /wallet`: Màn hình Quản lý ví.
- `POST /rating/:id`: Popup/Modal Đánh giá người dùng khác.

### 📦 C. Luồng Vật phẩm (`/api/items`)
- `GET /`: Trang Danh sách toàn bộ vật phẩm.
- `GET /:id`: Trang Chi tiết vật phẩm.
- `POST /`: Form Thêm mới vật phẩm (Hỗ trợ upload ảnh với trường `image`).
- `PUT /:id`: Form Sửa vật phẩm.
- `DELETE /:id`: Xoá vật phẩm (Nút / Popup xác nhận).

### 🔨 D. Luồng Phiên Đấu giá (`/api/auctions` & `/api/bids`)
- `GET /`: Trang Danh sách các phiên đấu giá (Đang diễn ra, Sắp tới, Kết thúc).
- `GET /:id`: Trang Chi tiết một phiên đấu giá (Hiển thị thông tin, đếm ngược T.gian, Lịch sử Bid).
- `POST /`: Form Lập phiên đấu giá mới (Chọn Item, Chỉnh các mức giá nhập liệu).
- `PUT /:id`: Sửa thông tin phiên đấu giá.
- `DELETE /:id`: Hủy/Xoá phiên đấu giá.
- `POST /:id/bid`: Nút Thực hiện Ra giá (Bid) trong phiên đấu giá.

---

## 3. Gợi ý cho Designer:
1. **Các Form cần làm:** Đăng ký, Đăng nhập, Thêm Vật phẩm (cần mục up ảnh Upload), Tạo phiên đấu giá, Cập nhật Profile.
2. **Các Input quan trọng:**
   - Phiên đấu giá: Giá khởi điểm, Bước giá (Slider / Input number), Giá mua đứt, Tiền đặt cọc, Chọn khoảng thời gian diễn ra (`startTime`, `endTime`).
   - Vật phẩm: Danh mục `category`, Thuộc tính bổ sung chuyên sâu dựa theo mục (`attributes` dưới dạng JSON động), phải có chức năng upload ảnh khi thêm vật phẩm mới và sửa vật phẩm.
   - Thanh toán: Chọn phương thức (Credit Card, Paypal, Bank).
3. **Các Thành phần Component cần thiết:**
   - Ảnh Avatar người dùng (`User.userImage`) và Ảnh Sản phẩm (`Item.itemImage`).
   - Nhãn (Badge/Tags) cho trạng thái: User (`active`/`unidentified`), Auction (`UPCOMING`/`HAPPENING`/`CLOSED`), Giao dịch (`PENDING`/`COMPLETED`).
   - UI hiển thị Thời gian đếm ngược (Countdown) cho Auction.
   - Bảng/Danh sách lịch sử ra giá.

4. **Khi create folder frontend, bạn phải làm theo cấu trúc front end chuẩn của react+vite**
****
