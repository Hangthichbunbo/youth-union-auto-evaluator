(async function autoApprove() {
  // Hàm lấy danh sách nút "Duyệt" ban đầu ở bảng
  const getApproveButtons = () => {
    return Array.from(document.querySelectorAll('a, button, span, div')).filter(el => {
      const text = el.innerText ? el.innerText.trim() : '';
      return text === 'Duyệt' && el.offsetWidth > 0;
    });
  };

  let approveButtons = getApproveButtons();
  console.log(Tìm thấy ${approveButtons.length} hàng cần duyệt.);

  for (let i = 0; i < approveButtons.length; i++) {
    const currentBtns = getApproveButtons();
    if (currentBtns.length === 0) break;

    console.log([${i + 1}/${approveButtons.length}] Đang bấm "Duyệt" ở hàng...);
    currentBtns[0].click();

    // Chờ pop-up hiển thị (700ms)
    await new Promise(resolve => setTimeout(resolve, 700));

    // Bắt chính xác nút DUYỆT màu cam (.btn-warning) trên pop-up
    const confirmBtn = document.querySelector('button.btn-warning');

    if (confirmBtn && confirmBtn.innerText.trim().toUpperCase() === 'DUYỆT') {
      confirmBtn.click();
      console.log(-> Đã xác nhận duyệt thành công!);
    } else {
      console.log(-> Không tìm thấy nút xác nhận .btn-warning trên pop-up.);
    }

    // Chờ 1.2 giây để hệ thống xử lý xong trước khi sang người tiếp theo
    await new Promise(resolve => setTimeout(resolve, 1200));
  }

  console.log('Đã hoàn tất duyệt toàn bộ danh sách!');
})();
