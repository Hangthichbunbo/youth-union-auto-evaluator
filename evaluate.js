(async () => {
  // Test trước với false: script chỉ log tên, không chấm/lưu.
  const RUN = true;

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Hàm sinh mảng 26 điểm thỏa mãn: Tổng 70-85 và MỌI NHÓM LUÔN <= 18 ĐIỂM (An toàn tuyệt đối < 20)
  function generateValidScores() {
    // Số tiêu chí của từng nhóm: [Nhóm 1, Nhóm 2, Nhóm 3, Nhóm 4, Nhóm 5]
    const counts = [7, 6, 5, 4, 4];
    
    // Chọn ngẫu nhiên tổng điểm toàn bài từ 70 đến 85
    const targetTotal = Math.floor(Math.random() * (85 - 70 + 1)) + 70;

    // Khởi tạo điểm tối thiểu cho mỗi nhóm (mỗi ô ít nhất 2 điểm)
    let groupTotals = counts.map(c => c * 2);
    let currentSum = groupTotals.reduce((a, b) => a + b, 0);

    // Điểm tối đa an toàn cho từng nhóm (Nhóm 1 tối đa 18p, Nhóm 4 & 5 tối đa 16p do chỉ có 4 ô)
    const maxCaps = [18, 18, 18, 16, 16];

    // Vòng lặp phân bổ ngẫu nhiên từng điểm cho tới khi đạt targetTotal
    while (currentSum < targetTotal) {
      let idx = Math.floor(Math.random() * 5);
      if (groupTotals[idx] < maxCaps[idx]) {
        groupTotals[idx]++;
        currentSum++;
      }
    }

    // Hàm rải điểm đều vào từng ô trong nhóm
    function distributeGroup(count, totalGroupScore) {
      let arr = Array(count).fill(2);
      let sum = count * 2;
      while (sum < totalGroupScore) {
        let idx = Math.floor(Math.random() * count);
        if (arr[idx] < 4) { // Mỗi câu tối đa 4 điểm
          arr[idx]++;
          sum++;
        }
      }
      return arr;
    }

    // Tạo mảng điểm chi tiết cho từng nhóm
    const g1 = distributeGroup(counts[0], groupTotals[0]);
    const g2 = distributeGroup(counts[1], groupTotals[1]);
    const g3 = distributeGroup(counts[2], groupTotals[2]);
    const g4 = distributeGroup(counts[3], groupTotals[3]);
    const g5 = distributeGroup(counts[4], groupTotals[4]);

    return [...g1, ...g2, ...g3, ...g4, ...g5];
  }

  async function waitFor(check, timeout = 20000, step = 300) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const result = check();
      if (result) return result;
      await sleep(step);
    }

    throw new Error('Timeout: không tìm thấy phần tử cần thiết.');
  }

  function getRows() {
    return [...document.querySelectorAll('tr')]
      .filter(row => row.querySelectorAll('td').length > 0);
  }

  function getUngradedRow() {
    return getRows().find(row =>
      row.innerText.includes('Chưa đánh giá')
    );
  }

  function getCurrentPage() {
    const active = document.querySelector(
      '.ant-pagination-item-active, .pagination .active, [class*="pagination"] .active'
    );

    return active?.innerText.trim() ?? '';
  }

  function setInputValue(input, value) {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

    if (descriptor && descriptor.set) {
      descriptor.set.call(input, String(value));
    } else {
      input.value = String(value);
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  async function fillAndSave() {
    const inputs = await waitFor(() => {
      const found = [...document.querySelectorAll('input.ant-input-number-input')]
        .filter(input => input.offsetParent !== null);

      return found.length > 0 ? found : null;
    });

    // Cột input có vị trí ngoài cùng bên phải (Chi đoàn đánh giá)
    const maxX = Math.max(
      ...inputs.map(input => input.getBoundingClientRect().x)
    );

    const chiDoanInputs = inputs
      .filter(input =>
        Math.abs(input.getBoundingClientRect().x - maxX) < 40
      )
      .sort((a, b) =>
        a.getBoundingClientRect().y - b.getBoundingClientRect().y
      );

    console.log(`Tìm thấy ${chiDoanInputs.length} ô điểm.`);

    // Sinh mảng điểm động đạt chuẩn 70 - 85 điểm cho mỗi người
    const dynamicScores = generateValidScores();
    const currentTotalScore = dynamicScores.reduce((a, b) => a + b, 0);

    console.log(`Tạo bảng điểm ngẫu nhiên hợp lệ: Tổng = ${currentTotalScore} điểm`);

    chiDoanInputs.forEach((input, index) => {
      setInputValue(input, dynamicScores[index] ?? 2);
    });

    // Nhập ghi chú tự động vào ô textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(txt => setInputValue(txt, "Hoàn thành tốt"));

    await sleep(1200);

    const saveButton = await waitFor(() =>
      [...document.querySelectorAll('button')].find(button =>
        button.innerText.trim().toLowerCase().includes('lưu và quay lại')
      )
    );

    saveButton.click();

    // Chờ form biến mất và về lại bảng danh sách
    await waitFor(() =>
      !document.querySelector('input.ant-input-number-input') &&
      getRows().length > 0
    );

    await sleep(1000);
  }

  async function goToNextPage() {
    const oldPage = getCurrentPage();

    const next = document.querySelector(
      '.ant-pagination-next, li[title="Next Page"], [aria-label="Next Page"]'
    );

    if (!next) return false;

    const disabled =
      next.classList.contains('ant-pagination-disabled') ||
      next.classList.contains('disabled') ||
      next.getAttribute('aria-disabled') === 'true';

    if (disabled) return false;

    const clickable = next.querySelector('a, button') || next;
    clickable.click();

    await waitFor(() => {
      const newPage = getCurrentPage();
      return newPage && newPage !== oldPage;
    });

    await sleep(1000);
    return true;
  }

  let total = 0;

  while (true) {
    console.log(`Đang xử lý trang ${getCurrentPage() || '?'}`);

    // Chấm hết các dòng chưa đánh giá của trang hiện tại
    while (true) {
      const row = getUngradedRow();
      if (!row) break;

      const name = row.children[1]?.innerText.trim() || 'Không rõ tên';
      console.log(`→ ${name}`);

      if (!RUN) {
        console.log(`[TEST] Sẽ chấm: ${name}`);
        break;
      }

      // Nút bút chì cuối dòng
      const editButton = [...row.querySelectorAll('button')].at(-1);

      if (!editButton) {
        throw new Error(`Không tìm thấy nút bút chì của ${name}.`);
      }

      editButton.click();
      await fillAndSave();

      total++;
      console.log(`✓ Đã lưu: ${name} — tổng số đã chấm: ${total}`);
    }

    if (!RUN) break;

    const moved = await goToNextPage();
    if (!moved) break;
  }

  console.log(`HOÀN TẤT. Đã chấm ${total} đoàn viên.`);
})();
