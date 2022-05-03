import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnocssVitePlugin from 'unocss/vite';
import { presetAttributify, presetUno, presetIcons } from 'unocss';
// @ts-ignore
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    vue(),
    UnocssVitePlugin({
      presets: [
        presetAttributify({ /* preset options */ }),
        presetUno(),
        presetIcons()
      ],
      shortcuts: {
        'flex-center': 'items-center justify-center'
      }
    }),
    AutoImport({
      dts: 'src/auto.d.ts',
      includes: ['./src'],
      imports: ['vue']
    })
  ]
});
