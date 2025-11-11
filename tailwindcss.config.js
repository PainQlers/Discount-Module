/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          card: 'var(--card)',
          primary: 'var(--primary)',
          secondary: 'var(--secondary)',
          accent: 'var(--accent)',
          destructive: 'var(--destructive)',
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'var(--ring)',
          // เพิ่มสีอื่น ๆ ตามที่คุณต้องการ
        },
        fontFamily: {
          sans: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
        }
      },
    },
    plugins: [],
  }
  