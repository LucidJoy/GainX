import { useState } from "react";
import styles from "./Preview.module.sass";
import cn from "classnames";
import Image from "../../Image";
import Back from "../../Back";
import Icon from "../../Icon";
// import ModalShareProfile from "../../ModalShareProfile";

type PreviewProps = {
  className?: string;
  image: any;
  background: string;
  share?: boolean;
  url?: string;
};

const Preview = ({
  className,
  image,
  background,
  share,
  url,
}: PreviewProps) => {
  const [modalShare, setModalShare] = useState<boolean>(false);

  return (
    <div
      className={cn(styles.preview, className)}
      style={{ background: background }}
    >
      <Image src={image} width={372} height={372} alt='image' />
      <Back className={styles.back} tooltip='Back' url={url} dark />
      {share && (
        <>
          <button className={styles.share} onClick={() => setModalShare(true)}>
            <Icon name='share' size='20' />
          </button>
          {/* <ModalShareProfile
                        visibleModal={modalShare}
                        setVisibleModal={() => setModalShare(false)}
                    /> */}
        </>
      )}
    </div>
  );
};

export default Preview;
