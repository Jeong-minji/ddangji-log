import { FC } from "react";
import { useRouter } from "next/router";

import Navigation from "../Navigation/Navigation";

import { MainContent } from "./LayoutMainStyle";

import { LayoutMainProps } from "../../containerType";
import Footer from "../Footer/Footer";

const LayoutMain: FC<LayoutMainProps> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Navigation />
      <MainContent path={router.pathname}>{children}</MainContent>
      <Footer />
    </>
  );
};

export default LayoutMain;
