(async function runCompleteProcess() {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function triggerClick(el) {
    if (!el) return false;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function setInputValue(input, value) {
    if (!input) return;
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

  async function waitFor(checkFn, timeout = 10000, step = 300) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const res = checkFn();
      if (res) return res;
      await sleep(step);
    }
    return null;
  }

  // Hàm tạo điểm hợp lệ: Giới hạn mỗi nhóm < 20 điểm và tổng 5 nhóm đạt 77-88 điểm
  function generateValidScores() {
    function distributeGroup(count, maxTotal) {
      let arr = Array(count).fill(2); // Mỗi ô tối thiểu 2 điểm
      let current = count * 2;
      while (current < maxTotal) {
        let idx = Math.floor(Math.random() * count);
        if (arr[idx] < 4) {
          arr[idx]++;
          current++;
        }
      }
      return arr;
    }

    // Tải trọng điểm cho 5 nhóm (7 mục, 6 mục, 5 mục, 4 mục, 4 mục)
    const g1 = distributeGroup(7, Math.floor(Math.random() * 4) + 15); // 15 - 18 điểm
    const g2 = distributeGroup(6, Math.floor(Math.random() * 4) + 15); // 15 - 18 điểm
    const g3 = distributeGroup(5, Math.floor(Math.random() * 4) + 15); // 15 - 18 điểm
    const g4 = distributeGroup(4, Math.floor(Math.random() * 4) + 13); // 13 - 16 điểm
    const g5 = distributeGroup(4, Math.floor(Math.random() * 4) + 13); // 13 - 16 điểm

    return [...g1, ...g2, ...g3, ...g4, ...g5];
  }

  // 1. CHỌN LỌC TRẠNG THÁI "CHƯA ĐĂNG KÝ"
  console.log("[AUTO] Bắt đầu thao tác lọc...");
  const tabRegister = Array.from(document.querySelectorAll('div, button, a, span, .ant-tabs-tab')).find(el => el.innerText?.trim() === 'Đăng ký rèn luyện');
  if (tabRegister) {
    triggerClick(tabRegister);
    await sleep(1500);
  }

  const selectBox = document.querySelector('nz-select[nzplaceholdersholder*="Trạng thái"], nz-select, .ant-select-selector');
  if (selectBox) {
    triggerClick(selectBox);
    await sleep(800);

    const optionUnregistered = await waitFor(() => {
      return Array.from(document.querySelectorAll('nz-option-item, .ant-select-item-option, li.ant-select-item'))
        .find(el => el.innerText?.trim() === 'Chưa đăng ký');
    }, 5000);

    if (optionUnregistered) {
      triggerClick(optionUnregistered);
      console.log("[AUTO] Đã chọn 'Chưa đăng ký'.");
      await sleep(1000);
    }
  }

  const searchBtn = document.querySelector('button.ant-btn-primary i.anticon-search')?.parentElement || 
                    Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector('i.anticon-search') || btn.querySelector('svg[data-icon="search"]') || btn.classList.contains('ant-btn-primary'));

  if (searchBtn) {
    triggerClick(searchBtn);
    console.log("[AUTO] Đã bấm nút Tìm kiếm.");
    await sleep(3000);
  }

  // 2. ĐĂNG KÝ RÈN LUYỆN NẾU CÓ DỮ LIỆU
  let processRegister = true;
  while (processRegister) {
    const noData = document.body.innerText.includes('Không có dữ liệu') || document.querySelectorAll('tbody tr').length === 0;

    if (noData) {
      console.log("[AUTO] Kết quả: 'Không có dữ liệu' -> Chuyển sang Tab Đánh giá rèn luyện.");
      break;
    }

    const headerCheck = document.querySelector('th.ant-table-selection-column input[type="checkbox"], nz-table-selection label, input.ant-checkbox-input');
    if (headerCheck) {
      triggerClick(headerCheck);
      await sleep(1000);
    }

    const btnRegMain = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Đăng ký') && el.offsetWidth > 0);
    if (btnRegMain) {
      triggerClick(btnRegMain);

      await waitFor(() => document.body.innerText.includes('Nội dung đăng ký'), 8000);
      await sleep(1500);

      const contentCheck = document.querySelector('th.ant-table-selection-column input[type="checkbox"], nz-table-selection label, .blue-table input, input.ant-checkbox-input');
      if (contentCheck) {
        triggerClick(contentCheck);
        await sleep(1000);
      }

      const btnRegConfirm = Array.from(document.querySelectorAll('button')).find(el => el.innerText.trim() === 'Đăng ký' && el.offsetWidth > 0);
      if (btnRegConfirm) {
        triggerClick(btnRegConfirm);
        await sleep(3500);
      }

      if (searchBtn) {
        triggerClick(searchBtn);
        await sleep(2500);
      }
    } else {
      processRegister = false;
    }
  }

  // 3. ĐÁNH GIÁ RÈN LUYỆN VỚI ĐIỂM CHIA THEO NHÓM CHUẨN
  console.log("[AUTO] Chuyển sang Tab Đánh giá rèn luyện...");
  const tabGrade = Array.from(document.querySelectorAll('div, button, a, span, .ant-tabs-tab')).find(el => el.innerText?.trim() === 'Đánh giá rèn luyện');
  if (tabGrade) {
    triggerClick(tabGrade);
    await sleep(2500);
  }

  while (true) {
    await sleep(1500);
    const getUngradedRow = () => [...document.querySelectorAll('tr')].filter(r => r.querySelectorAll('td').length > 0).find(row => row.innerText.includes('Chưa đánh giá'));

    while (true) {
      const row = getUngradedRow();
      if (!row) break;

      const editBtn = [...row.querySelectorAll('button, a, i')].find(el => el.classList.contains('anticon-edit') || el.getAttribute('nztype') === 'edit' || el.querySelector('i[nztype="edit"]') || el.classList.contains('fa-pencil')) || [...row.querySelectorAll('button')].at(-1);
      if (!editBtn) break;

      triggerClick(editBtn);

      const inputs = await waitFor(() => {
        const found = [...document.querySelectorAll('input.ant-input-number-input')].filter(input => input.offsetParent !== null);
        return found.length > 0 ? found : null;
      }, 10000);

      if (inputs) {
        const maxX = Math.max(...inputs.map(input => input.getBoundingClientRect().x));
        const chiDoanInputs = inputs
          .filter(input => Math.abs(input.getBoundingClientRect().x - maxX) < 40)
          .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);

        // Sinh mảng điểm đã kiểm soát trần 20 điểm/nhóm
        const validScores = generateValidScores();

        chiDoanInputs.forEach((input, index) => {
          setInputValue(input, validScores[index] ?? 2);
        });

        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(txt => setInputValue(txt, "Hoàn thành tốt"));

        await sleep(1200);

        const saveButton = [...document.querySelectorAll('button')].find(button => button.innerText.trim().toLowerCase().includes('lưu và quay lại'));
        if (saveButton) {
          triggerClick(saveButton);
        }

        await waitFor(() => !document.querySelector('input.ant-input-number-input') && document.querySelectorAll('tbody tr').length > 0, 10000);
        await sleep(1500);
      }
    }

    const next = document.querySelector('.ant-pagination-next, li[title="Next Page"], [aria-label="Next Page"]');
    if (!next) break;

    const disabled = next.classList.contains('ant-pagination-disabled') || next.classList.contains('disabled') || next.getAttribute('aria-disabled') === 'true';
    if (disabled) break;

    const clickable = next.querySelector('a, button') || next;
    triggerClick(clickable);
    await sleep(2500);
  }

  console.log("[AUTO] QUY TRÌNH HOÀN TẤT THÀNH CÔNG!");
})();
