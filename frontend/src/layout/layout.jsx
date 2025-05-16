import react from 'react';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Routers from '../routes/routers';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  );
}

export default Layout;