import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";

type NavLinkProps = {
  className?: string;
  activeClassName?: any;
  href: string;
  onClick?: any;
  children: React.ReactNode;
};

const NavLink = ({
  className,
  activeClassName,
  href,
  onClick,
  children,
}: NavLinkProps) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <div
        className={cn(className, {
          [activeClassName]: router.pathname === href,
        })}
        onClick={onClick}
        style={{ marginBottom: "10px" }}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
