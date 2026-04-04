import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

export default {
  // 1. CẤU HÌNH ĐÓNG GÓI (PACKAGER)
  packagerConfig: {
    name: 'Yuta Hub',         // Tên hiển thị của file .exe
    executableName: 'yutahub', // Tên tiến trình hệ thống (viết liền)
    asar: true,               // Nén code vào file app.asar để bảo mật và nhanh hơn
    
    // Loại bỏ các file không cần thiết để giảm dung lượng app cực mạnh
    ignore: [
      /^\/src/,               // Không đóng gói code React gốc
      /^\/public/,            // Không đóng gói thư mục public gốc (Vite đã build vào dist)
      /^\/tsconfig.json/,
      /^\/vite.config.ts/,
      /\.map$/,               // Không đóng gói file map của javascript
      /^\/\.env/              // Không đóng gói file .env (Vite đã nhúng Key vào build rồi)
    ],
  },
  
  rebuildConfig: {},

  // 2. CẤU HÌNH TRÌNH TẠO BẢN CÀI ĐẶT (MAKERS)
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Tên định danh cho Windows Registry
        name: 'yutahub',
        authors: 'Yuta',
        description: 'Trung tâm ứng dụng Yuta Hub',
        // Tên file cài đặt đầu ra bạn sẽ nhận được
        setupExe: 'YutaHub-Setup.exe',
        // Nếu bạn có icon, hãy bỏ comment dòng dưới và trỏ đúng đường dẫn file .ico
        // setupIcon: './path/to/icon.ico', 
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          productName: 'Yuta Hub',
          categories: ['Utility'],
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],

  // 3. CÁC PLUGINS HỖ TRỢ
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses giúp bảo mật app, ngăn chặn việc chạy code Node.js trái phép
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};