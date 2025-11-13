// app/fonts.ts
import localFont from "next/font/local";

export const bosch = localFont({
  src: [
    {
      path: "../public/fonts/Bosch.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Bosch.woff",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
});
