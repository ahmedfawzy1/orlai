import {
  defaultAuthConfig,
  defaultLogoConfig,
  defaultMenuItems,
  MenuItem,
} from './menuConfig';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import HeaderIcons from './HeaderIcons';
import DesktopUserMenu from './DesktopUserMenu';

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    width: number;
    height: number;
  };
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
  };
}

const Navbar = ({
  logo = defaultLogoConfig,
  menu = defaultMenuItems,
  auth = defaultAuthConfig,
}: NavbarProps) => {
  return (
    <header className='px-4 py-3 bg-white shadow-xs sticky top-0 inset-x-0 z-50'>
      <div className='max-w-[1280px] mx-auto'>
        {/* Desktop Menu */}
        <div className='hidden lg:flex justify-between items-center'>
          <Logo {...logo} />
          <div className='flex items-center gap-6'>
            <DesktopNav menuItems={menu} />
          </div>
          <div className='flex justify-center gap-2.5'>
            <HeaderIcons />
            <DesktopUserMenu />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileNav menuItems={menu} logo={logo} auth={auth} />
      </div>
    </header>
  );
};

export { Navbar };
