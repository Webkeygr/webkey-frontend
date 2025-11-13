// app/fonts.ts
import localFont from "next/font/local";

export const bosch = localFont({
  src: "../public/fonts/Bosch.otf", // μονοπάτι σε σχέση με το fonts.ts
  weight: "400",
  style: "normal",
  display: "swap",
});
