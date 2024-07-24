import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#64BCFC',
        'primary-dark': '#4A9FE0',
        'secondary': '#68C5F3',
        'secondary-dark': '#4FA8D6',
        'accent': '#454545',
        'background': '#DFDFDF',
        'warning': '#FFC107', // 警告色
        'success': '#28A745', // 成功色
        'error': '#DC3545',   // エラー色
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
export default config;
