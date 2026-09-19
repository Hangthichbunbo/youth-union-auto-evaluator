(async function runFullWorkflow() {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function triggerClick(el) {
    if (!el) return false;
    try {
      const opts = { bubbles: true, cancelable: true, view: window };
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.dispatchEvent(new MouseEvent('click', opts));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (e) {
      return false;
    }
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

  function generateValidScores() {
    function distributeGroup(count, maxTotal) {
      let arr = Array(count).fill(2);
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
    const g1 = distributeGroup(7, Math.floor(Math.random() * 4) + 15);
    const g2 = distributeGroup(6, Math.floor(Math.random() * 4) + 15);
    const g3 = distributeGroup(5, Math.floor(Math.random() * 4) + 15);
    const g4 = distributeGroup(4, Math.floor(Math.random() * 4) + 13);
    const g5 = distributeGroup(4, Math.floor(Math.random() * 4) + 13);
    return [...g1, ...g2, ...g3, ...g4, ...g5];
  }

  // BƯỚC 1: DUYỆT THÔNG TIN ĐOÀN VIÊN (NẾU ĐANG Ở TRANG DUYỆT)
  if (window.location.href.includes('duyet-thong-tin')) {
    console.log("[AUTO] Đang duyệt thông tin đoàn viên...");
    let hasNext = true;
    while (hasNext) {
      const getBtns = () => Array.from(document.querySelectorAll('a, button, span, i')).filter(el => el.innerText?.trim() === 'Duyệt' && el.offsetWidth > 0);
      let btns = getBtns();

      for (let i = 0; i < btns.length; i++) {
        let currentBtns = getBtns();
        if (!currentBtns.length) break;

        triggerClick(currentBtns[0]);
        await sleep(800);

        let confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('DUYỆT'));
        if (confirmBtn) {
          triggerClick(confirmBtn);
        }
        await sleep(1500);
      }

      const nextBtn = document.querySelector('.ant-pagination-next:not(.ant-pagination-disabled), li[title="Next Page"]:not(.ant-pagination-disabled), .pagination .next');
      if (nextBtn && !nextBtn.classList.contains('ant-pagination-disabled')) {
        triggerClick(nextBtn.querySelector('a, button') || nextBtn);
        await sleep(3000);
      } else {
        hasNext = false;
      }
    }

    console.log("[AUTO] Duyệt hoàn tất! Tự động chuyển hướng sang trang Chương trình rèn luyện...");
    sessionStorage.setItem('AUTO_RUN_NEXT', 'true');
    window.location.href = 'https://quanlydoanvien.doanthanhnien.vn/chuong-trinh-ren-luyen';
    return;
  }

  // BƯỚC 2: TỰ ĐỘNG THỰC HIỆN KHI SANG TRANG RÈN LUYỆN
  console.log("[AUTO] Đã vào trang Chương trình rèn luyện. Đang khởi chạy quy trình...");
  sessionStorage.removeItem('AUTO_RUN_NEXT');
  await sleep(2000);

  console.log("[AUTO] Bắt đầu lọc trạng thái Chưa đăng ký...");
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
    await sleep(4000);
  }

  // BƯỚC 3: ĐĂNG KÝ RÈN LUYỆN
  while (true) {
    const hasRows = document.querySelectorAll('tbody tr').length > 0;
    const noData = document.body.innerText.includes('Không có dữ liệu') || !hasRows;

    if (noData) {
      console.log("[AUTO] Không có dữ liệu chưa đăng ký -> Chuyển sang Tab Đánh giá rèn luyện.");
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
        await sleep(3000);
      }
    } else {
      break;
    }
  }

  // BƯỚC 4: ĐÁNH GIÁ RÈN LUYỆN
  console.log("[AUTO] Chuyển sang Tab Đánh giá rèn luyện...");
  const tabGrade = Array.from(document.querySelectorAll('div, button, a, span, .ant-tabs-tab')).find(el => el.innerText?.trim() === 'Đánh giá rèn luyện');
  if (tabGrade) {
    triggerClick(tabGrade);
    await sleep(3000);
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
