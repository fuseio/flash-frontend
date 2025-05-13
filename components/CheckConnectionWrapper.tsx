import { Button } from '@/components/ui/button';
import useUser from '@/hooks/useUser';
import { Status } from '@/lib/types';
import { cn } from '@/lib/utils';

type CheckConnectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentProps<"button"> | any;
}

export const CheckConnectionWrapper = ({ children, className, props }: CheckConnectionWrapperProps) => {
  const { userStatus } = useUser();

  if (userStatus === Status.PENDING) {
    return (
      <Button className={cn("animate-pulse", className)} disabled {...props} />
    );
  }

  return children;
};
