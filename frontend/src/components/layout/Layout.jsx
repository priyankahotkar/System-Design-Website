import Header from './Header';
import Footer from './Footer';
import EmailVerificationNotice from '../auth/EmailVerificationNotice';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <EmailVerificationNotice />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;