import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
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

const navigationMenuLinkClassNames = {
  pressable: 'group inline-flex h-8 w-max items-center justify-center rounded-full px-4 py-2 transition-colors hover:bg-primary focus:bg-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50',
  text: "text-lg font-semibold text-foreground group-hover:text-primary-foreground group-focus:text-primary-foreground",
}

const NavigationMenuLink = React.forwardRef<React.ComponentRef<typeof Pressable>, NavigationMenuLinkProps>(
  ({ onPress, className, active, children }, ref) => {
    const pressableClass = cn(
      navigationMenuLinkClassNames.pressable,
      active && "bg-primary"
    )

    const textClass = cn(
      navigationMenuLinkClassNames.text,
      active && "text-primary-foreground"
    )

    return (
      <TextClassContext.Provider value={textClass}>
        <Pressable
          ref={ref}
          onPress={onPress}
          className={cn(
            pressableClass,
            textClass,
            className
          )}
        >
          {children}
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
NavigationMenuLink.displayName = 'NavigationMenuLink';

const navigationMenuTriggerStyle = () => {
  return cn(
    navigationMenuLinkClassNames.pressable,
    navigationMenuLinkClassNames.text
  );
};

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
};
