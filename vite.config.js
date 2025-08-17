import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/honey-site/', // اگر اسم ریپو را عوض کردی، همین‌جا هم عوض کن
})
