import { useEffect, useState, useContext } from "react";
import styles from "./CardDetails.module.sass";
import cn from "classnames";
import Preview from "../../Details/Preview";
import Description from "../../Details/Description";
import Icon from "../../Icon";
import TabDescription from "./TabDescription";
import TabDetails from "./TabDetails";
import History from "../../Details/History";
// import ModalShareProfile from "../../ModalShareProfile";
import ModalPurchase from "../../ModalPurchase";
import { useRouter } from "next/router";

import { characters } from "../../../mocks/characters";
import { history } from "../../../mocks/characterDetails";
import CreateLendContext from "../../../context/LendContext";

const imagePreview = {
  src: "/images/content/characters/image-3.png",
  width: 700,
  height: 700,
  alt: "Character",
};

const navigation: Array<string> = ["Description", "Details", "History"];

type CardDetailsProps = {};

const CardDetails = ({}: CardDetailsProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [visibleShare, setVisibleShare] = useState<boolean>(false);
  const [visiblePurchase, setVisiblePurchase] = useState<boolean>(false);

  const {
    allListings,
    setAllListings,
    activeObject,
    setActiveObject,
    acceptOffer,
  } = useContext(CreateLendContext);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    let obj, ch;
    // obj = characters.find(() => allListings.escrowId === id);
    obj = allListings.find((listing) => listing.escrowId == id);
    ch = characters.find((char) => char.code == id);

    setActiveObject({
      title: ch.title,
      escrowId: obj.escrowId.toString(),
      amount: obj.amount,
      image: ch.image.src,
      tenure: obj.tenure.toString(),
      apy: obj.apy.toString(),
      borrower: obj.borrower,
      accepted: obj.accepted,
      isInsuared: obj.isInsuared,
      lender: obj.lender,
      nftAddress: obj.nftAddress,
      nftId: obj.nftId.toString(),
    });

    // obj1 = {
    //   title: "arv",
    //   escrowId: obj?.escrowId,
    //   amount: obj?.amount,
    //   image: "joy",
    //   tenure: obj?.tenure,
    // };
  }, [allListings]);

  useEffect(() => console.log("==> ", activeObject), [activeObject]);
  // useEffect(() => console.log("===> ", allListings), []);

  // console.log("===> ", allListings);

  return (
    <div className={cn("section-main", styles.section)}>
      <div className={cn("container-xl", styles.container)}>
        <div className={styles.row}>
          <Preview
            className={styles.preview}
            image={activeObject.image}
            background='#E5DCF3'
            url='/marketplace'
          />
          <div className={styles.wrap}>
            <Description
              className={styles.description}
              title={activeObject.title}
              code={id}
              crypto={`${activeObject.amount} TFil`}
              price={`${activeObject.tenure} Months`}
            />
            <div className={styles.control}>
              <button
                className={cn("button", styles.button)}
                onClick={() => setVisiblePurchase(true)}
              >
                Lend
              </button>
              <ModalPurchase
                visibleModal={visiblePurchase}
                setVisibleModal={() => setVisiblePurchase(false)}
              />
              {/* <button
                className={styles.share}
                onClick={() => setVisibleShare(true)}
              >
                <Icon name='share' />
              </button> */}
              {/* <ModalShareProfile
                                visibleModal={visibleShare}
                                setVisibleModal={() => setVisibleShare(false)}
                            /> */}
            </div>
            <div className={styles.nav}>
              {navigation.map((link, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  onClick={() => setActiveIndex(index)}
                  key={index}
                >
                  {link}
                </button>
              ))}
            </div>
            <div className={styles.group}>
              {activeIndex === 0 && <TabDescription />}
              {activeIndex === 1 && <TabDetails />}
              {activeIndex === 2 && <History items={history} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
