import Link from "next/link";
import Image from "../Image";
import cn from "classnames";
import styles from "./Logo.module.sass";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => (
  <Link href='/'>
    <div className={cn(styles.logo, className)}>
      <Image
        src='/images/gainxlogo.png'
        width='200'
        height='100'
        alt='AstroClash'
      />
    </div>
  </Link>
);

export default Logo;
