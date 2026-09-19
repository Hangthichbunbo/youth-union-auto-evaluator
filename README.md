# Tool Tự Động Hóa Quản Lý Đoàn Viên (Chrome Console Script)

Công cụ tự động hóa các thao tác trên hệ thống Quản lý Đoàn viên (`quanlydoanvien.doanthanhnien.vn`). 

Script giúp tự động thực hiện toàn bộ quy trình:
1. **Duyệt thông tin đoàn viên:** Duyệt toàn bộ danh sách chờ duyệt qua từng trang.
2. **Đăng ký rèn luyện:** Lọc danh sách đoàn viên "Chưa đăng ký", tự động chọn tất cả và xác nhận đăng ký nội dung rèn luyện.
3. **Đánh giá rèn luyện:** Tự động điền điểm ngẫu nhiên đạt tổng từ 77 - 88 điểm (được kiểm soát hợp lệ < 20 điểm/nhóm nội dung để không vi phạm quy định hệ thống), tự động điền ghi chú "Hoàn thành tốt" và lưu kết quả.

---

## Hướng Dẫn Sử Dụng

## Cách 1: Mã thực hiện tất cả quy trình từ Duyệt -> Đăng kí rèn luyện -> Đánh giá rèn luyện.
### Bước 1: Mở Công Cụ Developer Tools
1. Đăng nhập vào trang quản lý đoàn viên trên trình duyệt Chrome hoặc Microsoft Edge.
2. Truy cập vào trang **Nghiệp vụ quản lý đoàn viên** -> **Chương trình rèn luyện đoàn viên** (hoặc trang Duyệt thông tin đoàn viên).
3. Nhấn phím **F12** (hoặc chuột phải chọn **Inspect / Kiểm tra**) để mở DevTools.
4. Chuyển sang tab **Console**.

### Bước 2: Bật Quyền Dán Code (Nếu Được Yêu Cầu)
Nếu trình duyệt hiển thị cảnh báo bảo mật màu vàng `Warning: Don't paste code...`:
1. Gõ cụm từ `allow pasting` vào dòng lệnh Console.
2. Nhấn **Enter**.

### Bước 3: Chạy Script Tự Động
1. Sao chép toàn bộ mã trong file `index.js`.
2. Dán mã vào tab **Console**.
3. Nhấn **Enter** và để script tự động thực thi.

### Bước 4: Kiểm tra lại điểm và nộp lên trên - phần kiểm tra này thì vẫn cần con người cho chắc chắn:)) 
1. Kiểm tra điểm đã phù hợp chưa (vì là tool chấm ngẫu nhiên điểm nên nếu chưa hài lòng hãy sửa lại).
2. Tích tất cả các đoàn viên.
3. Nhấn **Chuyển cấp trên** và để hoàn thành.

## Cách 2: Nếu **Cách 1** bị lỗi hãy thử cách này. Nó tách biệt phần Duyệt và Đánh giá rèn luyện và việc Đăng kí rèn luyện cần làm thủ công
### Bước 1: Mở Công Cụ Developer Tools
1. Đăng nhập vào trang quản lý đoàn viên trên trình duyệt Chrome hoặc Microsoft Edge.
2. Truy cập vào trang **Nghiệp vụ quản lý đoàn viên** -> **Duyệt thông tin đoàn viên từ app TNVN**.
3. Nhấn phím **F12** (hoặc chuột phải chọn **Inspect / Kiểm tra**) để mở DevTools.
4. Chuyển sang tab **Console**.

### Bước 2: Bật Quyền Dán Code (Nếu Được Yêu Cầu)
Nếu trình duyệt hiển thị cảnh báo bảo mật màu vàng `Warning: Don't paste code...`:
1. Gõ cụm từ `allow pasting` vào dòng lệnh Console.
2. Nhấn **Enter**.

### Bước 3: Chạy Script Tự Động 
1. Sao chép toàn bộ mã trong file `approve.js` dán mã vào tab **Console** và nhấn **Enter** và để script tự động thực thi.
2. Sau khi duyệt xong hãy chuyển sang trang **Chương trình rèn luyện Đoàn viên**.
3. Chọn năm, ở ô **Trạng thái đăng ký** chọn **Chưa đăng ký** rồi bấm tìm kiếm. Chọn tất cả đoàn viên chưa đăng ký và thực hiện đăng ký nội dung rèn luyện.
6. Ấn chuyển sang tab **Đánh giá rèn luyện**. Sao chép toàn bộ mã trong file `evaluate.js` dán vào **Console** và nhấn **Enter**.

### Bước 4: Kiểm tra lại điểm và nộp lên trên - phần kiểm tra này thì vẫn cần con người cho chắc chắn:)) 
1. Kiểm tra điểm đã phù hợp chưa (vì là tool chấm ngẫu nhiên điểm nên nếu chưa hài lòng hãy sửa lại).
2. Tích tất cả các đoàn viên.
3. Nhấn **Chuyển cấp trên** và để hoàn thành.
---

## Lưu Ý Trong Quá Trình Chạy
* **Không tắt tab hoặc Reload trang:** Script chạy dưới dạng SPA (Single Page Application) để giữ trạng thái làm việc.
* **Theo dõi tiến trình:** Mọi trạng thái xử lý sẽ được in ra tại tab **Console** dạng log `[AUTO]...`.
* **Môi trường thực thi:** Đảm bảo ô chọn Execution Context ở góc trên bên trái Console đang ở trạng thái `top`.

---

