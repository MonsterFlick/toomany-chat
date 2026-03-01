import "./globals.css";

export const metadata = {
  title: "TooMany Chat — Instagram Automation & Analytics",
  description: "Instagram support platform with real-time analytics, video insights, and comment-triggered DM automation with follow-gate.",
  keywords: "Instagram, automation, analytics, DM, comments, reels, insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
