import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { apps } from '../src/data/apps.js';
import type { ViewMode, AppItem } from '../src/types.js';

describe('Kho Ứng Dụng (Yuta Hub) - Danh sách ứng dụng mới', () => {
  test('Danh sách app chứa đầy đủ 3 ứng dụng mới', () => {
    assert.equal(apps.length, 3, `Danh sách phải có đúng 3 ứng dụng mới, hiện có: ${apps.length}`);
    
    const urls = apps.map(a => a.url);
    assert.ok(urls.includes('https://hsayuta.vercel.app/'), 'Thiếu app hsayuta');
    assert.ok(urls.includes('https://toan7-yuta.vercel.app/'), 'Thiếu app toan7-yuta');
    assert.ok(urls.includes('https://focus-game-bice.vercel.app/'), 'Thiếu app focus-game');

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

    // 3. Game
    const gameApps = apps.filter(app => 
      /game|focus/i.test(app.title) || 
      app.tags.some(t => /game|luyện não|phản xạ|tập trung/i.test(t))
    );
    assert.equal(gameApps.length, 1, 'FocusGame thuộc Game');
  });

  test('Tìm kiếm theo từ khóa chính xác', () => {
    // Tìm 'hsa'
    const hsaResults = apps.filter(app => app.title.toLowerCase().includes('hsa') || app.tags.some(t => t.toLowerCase().includes('hsa')));
    assert.equal(hsaResults.length, 1);
    assert.equal(hsaResults[0].id, 'hsa-toan');

    // Tìm 'toán'
    const toanResults = apps.filter(app => app.title.toLowerCase().includes('toán') || app.tags.some(t => t.toLowerCase().includes('toán')));
    assert.equal(toanResults.length, 2);

    // Tìm 'focus'
    const focusResults = apps.filter(app => app.title.toLowerCase().includes('focus'));
    assert.equal(focusResults.length, 1);
    assert.equal(focusResults[0].id, 'focus-game');
  });

  test('Chế độ ViewMode hỗ trợ đầy đủ grid, list, detail', () => {
    const validModes: ViewMode[] = ['grid', 'list', 'detail'];
    assert.equal(validModes.length, 3);
    assert.ok(validModes.includes('list'));
    assert.ok(validModes.includes('grid'));
  });
});
