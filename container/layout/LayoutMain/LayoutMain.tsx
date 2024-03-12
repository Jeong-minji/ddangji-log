import { FC } from "react";
import { useRouter } from "next/router";

import Navigation from "../Navigation/Navigation";

import { MainContent } from "./LayoutMainStyle";

import { LayoutMainProps } from "../../containerType";
import Footer from "../Footer/Footer";
import useScrollDirection from "../../../utils/hooks/useScrollDirection";

const LayoutMain: FC<LayoutMainProps> = ({ children }) => {
  const router = useRouter();
  const { isScrollUp } = useScrollDirection();

  return (
    <>
      <Navigation />
      <MainContent path={router.pathname}>{children}</MainContent>
      <Footer isVisible={isScrollUp} />
    </>
  );
};

export default LayoutMain;
