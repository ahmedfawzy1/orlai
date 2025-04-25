import Link from 'next/link';
import { MenuItem } from './menuConfig';
import { icons } from './icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/app/components/ui/navigation-menu';

interface DesktopNavProps {
  menuItems: MenuItem[];
}

const DesktopNav = ({ menuItems }: DesktopNavProps) => {
  return (
    <nav className='hidden justify-between lg:flex'>
      <div className='flex items-center gap-6'>
        <div className='flex items-center'>
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map(item => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className='bg-popover text-popover-foreground'>
          {item.items.map(subItem => (
            <NavigationMenuLink asChild key={subItem.title} className='w-80'>
              <Link
                href={subItem.url}
                className='flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground'
              >
                <div className='text-foreground'>
                  {subItem.icon && icons[subItem.icon]}
                </div>
                <div>
                  <div className='text-sm font-semibold'>{subItem.title}</div>
                  {subItem.description && (
                    <p className='text-sm leading-snug text-muted-foreground'>
                      {subItem.description}
                    </p>
                  )}
                </div>
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link
        href={item.url}
        className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground'
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
};

export default DesktopNav;
