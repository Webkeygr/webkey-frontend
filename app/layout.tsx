// app/layout.jsx
export const metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web experiences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
