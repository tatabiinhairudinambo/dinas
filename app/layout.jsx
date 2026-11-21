import '../src/styles/index.css';

export const metadata = {
  title: 'Web Kedinasan',
  description: 'Try out SKD — TWK, TIU, TKP',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
