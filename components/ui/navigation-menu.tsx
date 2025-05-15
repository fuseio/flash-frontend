import { Pressable, View, type PressableProps } from 'react-native';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavigationMenuProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface NavigationMenuItemProps {
  value: string;
  children: React.ReactNode;
}

interface NavigationMenuLinkProps extends PressableProps {
  onPress?: () => void;
  className?: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavigationMenu = React.forwardRef<View, NavigationMenuProps>(
  ({ value, onValueChange, className, children }, ref) => {
    return (
      <View ref={ref} className={cn('relative', className)}>
        {children}
      </View>
    );
  }
);
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<View, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <View ref={ref} className="flex flex-row items-center gap-1">
        {children}
      </View>
    );
  }
);
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = React.forwardRef<View, NavigationMenuItemProps>(
  ({ value, children }, ref) => {
    return (
      <View ref={ref} className="relative">
        {children}
      </View>
    );
  }
);
NavigationMenuItem.displayName = 'NavigationMenuItem';

const NavigationMenuLink = React.forwardRef<React.ElementRef<typeof Pressable>, NavigationMenuLinkProps>(
  ({ onPress, className, active, children }, ref) => {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        className={cn(
          'group inline-flex h-8 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
          active && 'bg-accent text-accent-foreground',
          className
        )}
      >
        {children}
      </Pressable>
    );
  }
);
NavigationMenuLink.displayName = 'NavigationMenuLink';

const navigationMenuTriggerStyle = () => {
  return 'group inline-flex h-8 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50';
};

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
};
