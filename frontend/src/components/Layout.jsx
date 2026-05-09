import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-navy-950">
      <Header />
      <main>{children}</main>
    </div>
  );
}
