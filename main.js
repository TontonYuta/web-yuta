import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import squirrelStartup from 'electron-squirrel-startup';

// 1. XỬ LÝ SQUIRREL STARTUP (QUAN TRỌNG ĐỂ HIỆN TRÊN START MENU)
// Đoạn này giúp Windows tạo/xóa shortcut khi cài đặt hoặc gỡ bỏ ứng dụng.
if (squirrelStartup) {
  app.quit();
}

// 2. CẤU HÌNH ĐƯỜNG DẪN CHO ES MODULE
// Vì bạn dùng "type": "module", chúng ta cần cách này để lấy __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  // 3. KHỞI TẠO CỬA SỔ ỨNG DỤNG
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Yuta Hub", // Tiêu đề cửa sổ
    webPreferences: {
      // Bảo mật: Không cho phép script ở giao diện truy cập trực tiếp vào hệ thống
      nodeIntegration: false,
      contextIsolation: true,
      // Nếu bạn có file preload.js thì thêm ở đây:
      // preload: path.join(__dirname, 'preload.js')
    },
  });

  // 4. LOAD GIAO DIỆN TỪ THƯ MỤC DIST (SAU KHI VITE BUILD)
  // Khi đóng gói, file index.html sẽ nằm trong thư mục dist
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  mainWindow.loadFile(indexPath).catch((err) => {
    console.error("Lỗi: Không tìm thấy file giao diện tại:", indexPath);
    console.error("Hãy đảm bảo bạn đã chạy 'npm run build' trước khi chạy app.");
  });

  // Mở DevTools tự động khi phát triển (Bỏ comment dòng dưới nếu muốn soi lỗi)
  // mainWindow.webContents.openDevTools();
}

// 5. QUY TRÌNH KHỞI CHẠY APP
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // Trên macOS, tạo lại cửa sổ khi nhấn vào icon ở dock nếu không có cửa sổ nào mở
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 6. ĐÓNG APP KHI TẤT CẢ CỬA SỔ ĐÃ TẮT
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Ngăn chặn các cảnh báo không cần thiết về bảo mật trong console
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';