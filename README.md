# 🎬 BC Cinema - Nền tảng Đặt vé xem phim Trực tuyến

<img width="1920" height="975" alt="image" src="https://github.com/user-attachments/assets/57dae7ba-6fa3-4c64-a609-36529dc49a50" />

<p align="center">
  <i>
    <b>Một ứng dụng Full-stack mô phỏng hệ thống rạp chiếu phim chuyên nghiệp, cho phép người dùng xem thông tin phim, đặt vé và mua combo đồ ăn trực tuyến.</b>     </i>
</p>

🔗 **Live Demo:** [Trải nghiệm Website tại đây](https://bccinema.vercel.app/)

---

## ✨ Tính năng nổi bật

### Dành cho Khách hàng (Client-side)
* **Trải nghiệm UI/UX sống động:** Banner Slider trang chủ với hiệu ứng ánh sáng (Spotlight animation) bằng CSS thuần.
* **Tra cứu thông tin:** Hiển thị đầy đủ danh sách Phim Đang Chiếu, Phim Sắp Chiếu, thông tin chi tiết (Trailer, Đạo diễn, Diễn viên).
* **Luồng đặt vé (Booking Flow):** Cho phép người dùng chọn phim, chọn suất chiếu, vị trí ghế ngồi và mua kèm Combo (Đồ ăn/Thức uống).
* **Quản lý Tài khoản:** Hệ thống Đăng nhập/Đăng ký. Yêu cầu đăng nhập trước khi mua vé (bảo lưu trạng thái đang chọn phim nếu chưa đăng nhập).

### Dành cho Quản trị viên (Admin-side) *(Nếu dự án của bạn có phần này)*
* Quản lý danh sách phim, lịch chiếu, phòng chiếu.
* Thống kê doanh thu vé và combo.

---

## 🛠️ Công nghệ sử dụng

**Frontend:**
* **Framework/Library:** React.js
* **Routing:** React Router DOM
* **Styling:** CSS thuần (Custom Animations & Layouts)
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)

**Backend & Database:**
* **Môi trường:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **Xác thực:** JSON Web Token (JWT)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local)

Để chạy dự án này trên máy tính cá nhân, bạn cần cài đặt [Node.js](https://nodejs.org/) và làm theo các bước sau:

### 1. Clone Repository
```bash
git clone (https://github.com/tranhoanggg/bccinema.git
cd bccinema
```
Sau khi đã clone dự án thành công, ở mỗi bước sau hãy mở dự án trong terminal và chạy câu lệnh theo hướng dẫn.

### 2. Thiết lập Backend (Server)
```bash
cd backend
npm install
```

### 3. Thiết lập Frontend (Client)
```bash
cd frontend
npm install
```

### 4. Khởi chạy dự án
4.1. Khởi chạy từng phần
```bash
cd backend
node server.js
cd ../frontend
npm start
```

4.2. Khởi chạy đồng thời
```bash
npm start
```

## 📸 Hình ảnh Dự án
<img width="1920" height="976" alt="image" src="https://github.com/user-attachments/assets/d5820f75-a4b1-4b5b-bb5a-393aa8526538" />
<p align="center">
  <i><b>Trang chủ - Nơi chúng ta thấy ngay những bộ phim đang hot nhất, nhưng bộ phim đang chiếu, những bộ phim sắp ra mắt cùng những combo ưu đã cực hot</b></i>
</p>

<img width="1920" height="976" alt="image" src="https://github.com/user-attachments/assets/805138ae-7c35-40ff-b409-84576b641dcd" />
<p align="center">
  <i><b>Trang Phim - Nơi chúng ta xem đầy đủ danh sách các bộ phim và dễ dàng tìm kiếm bộ phim mình quan tâm</b></i>
</p>

<img width="1920" height="974" alt="image" src="https://github.com/user-attachments/assets/a20ee26a-d0f8-4686-8d48-814315cb6784" />
<p align="center">
  <i><b>Trang Đồ ăn & thức uống - Cùng nhâm nhi và thuỏng thức bộ phim yêu thích một cách trọn vẹn nhất!</b></i>
</p>

<img width="1920" height="979" alt="image" src="https://github.com/user-attachments/assets/1728cf12-352f-4775-97f2-782827879b38" />
<p align="center">
  <i><b>Trang Quyền lợi - Tìm hiểu những đặc quyền vô cùng hấp dẫn chỉ dành cho hội viên của Best Choice Cinema!</b></i>
</p>

<img width="1919" height="979" alt="image" src="https://github.com/user-attachments/assets/7f8dc536-131a-4c8b-b680-d75c27aed183" />
<p align="center">
  <i><b>Trang Đăng nhập - Đăng nhập để thanh toán dễ dàng và hưởng các đặc quyền hội viên hấp dẫn!</b></i>
</p>

<img width="1920" height="976" alt="image" src="https://github.com/user-attachments/assets/d4ba0174-176d-41df-8b2f-7d17d3500997" />
<p align="center">
  <i><b>Cùng khám phá những bất ngờ độc đáo chỉ có tại website Best Choice Cinema!</b></i>
</p>





