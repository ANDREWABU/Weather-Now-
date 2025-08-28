// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Weather App",
  description: "Simple Weather App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
