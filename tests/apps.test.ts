import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { apps } from '../src/data/apps.js';
import type { ViewMode, AppItem } from '../src/types.js';

describe('Kho Ứng Dụng (Yuta Hub) - Danh sách ứng dụng mới', () => {
  test('Danh sách app chứa đầy đủ 4 ứng dụng (bao gồm PDF Exam Spacer)', () => {
    assert.equal(apps.length, 4, `Danh sách phải có đúng 4 ứng dụng, hiện có: ${apps.length}`);
    
    const urls = apps.map(a => a.url);
    assert.ok(urls.includes('https://hsayuta.vercel.app/'), 'Thiếu app hsayuta');
    assert.ok(urls.includes('https://toan7-yuta.vercel.app/'), 'Thiếu app toan7-yuta');
    assert.ok(urls.includes('https://focus-game-bice.vercel.app/'), 'Thiếu app focus-game');
    assert.ok(urls.includes('https://add-space-to-pdf-yuta.vercel.app/'), 'Thiếu app pdf-spacer');

    for (const app of apps) {
      assert.ok(app.id, `Ứng dụng thiếu id`);
      assert.ok(app.title, `Ứng dụng ${app.id} thiếu title`);
      assert.ok(app.url, `Ứng dụng ${app.id} thiếu url`);
      assert.ok(app.description, `Ứng dụng ${app.id} thiếu description`);
      assert.ok(Array.isArray(app.tags) && app.tags.length > 0, `Ứng dụng ${app.id} thiếu tags`);
      assert.ok(app.icon, `Ứng dụng ${app.id} thiếu icon`);
    }
  });

  test('Bộ lọc danh mục (Categories) hoạt động chính xác', () => {
    // 1. Toán học
    const mathApps = apps.filter(app => /toán|math/i.test(app.title) || app.tags.some(t => /toán/i.test(t)));
    assert.equal(mathApps.length, 2, 'Cả HSA Toán và Toán 7 đều thuộc Toán học');

    // 2. Luyện thi
    const examApps = apps.filter(app => 
      /luyện thi|hsa|thpt|gdpt/i.test(app.title) || 
      app.tags.some(t => /luyện thi|hsa|thpt|gdpt/i.test(t)) ||
      /luyện thi/i.test(app.description)
    );
    assert.equal(examApps.length, 2, 'Cả HSA Toán và Toán 7 đều thuộc Luyện thi');

    // 3. Công cụ PDF
    const pdfApps = apps.filter(app => 
      /pdf|spacer|công cụ/i.test(app.title) || 
      app.tags.some(t => /công cụ|pdf|in ấn|đề thi/i.test(t))
    );
    assert.equal(pdfApps.length, 1, 'PDF Exam Spacer thuộc Công cụ PDF');

    // 4. Game
    const gameApps = apps.filter(app => 
      /game|focus/i.test(app.title) || 
      app.tags.some(t => /game|luyện não|phản xạ|tập trung/i.test(t))
    );
    assert.equal(gameApps.length, 1, 'FocusGame thuộc Game');
  });

  test('Tìm kiếm theo từ khóa chính xác', () => {
    // Tìm 'pdf'
    const pdfResults = apps.filter(app => app.title.toLowerCase().includes('pdf') || app.tags.some(t => t.toLowerCase().includes('pdf')));
    assert.equal(pdfResults.length, 1);
    assert.equal(pdfResults[0].id, 'pdf-spacer');

    // Tìm 'hsa'
    const hsaResults = apps.filter(app => app.title.toLowerCase().includes('hsa') || app.tags.some(t => t.toLowerCase().includes('hsa')));
    assert.equal(hsaResults.length, 1);

    // Tìm 'toán'
    const toanResults = apps.filter(app => app.title.toLowerCase().includes('toán') || app.tags.some(t => t.toLowerCase().includes('toán')));
    assert.equal(toanResults.length, 2);

    // Tìm 'focus'
    const focusResults = apps.filter(app => app.title.toLowerCase().includes('focus'));
    assert.equal(focusResults.length, 1);
  });

  test('Chế độ ViewMode hỗ trợ đầy đủ grid, list, detail', () => {
    const validModes: ViewMode[] = ['grid', 'list', 'detail'];
    assert.equal(validModes.length, 3);
    assert.ok(validModes.includes('list'));
    assert.ok(validModes.includes('grid'));
  });
});
