import React from "react";
import Image from "next/image";

import {
  FooterWrapper,
  FooterContact,
  FooterContainer,
  FooterContents,
  FooterInfo,
  FooterIcons,
  FooterDescription,
  FooterAnchor,
} from "./FooterStyle";

import { FOOTER } from "../../../lib/config/blogConfig";

export interface FooterProps {
  isVisible: boolean;
}

const Footer = ({ isVisible }: FooterProps) => {
  return (
    <FooterWrapper isVisible={isVisible}>
      <FooterContainer>
        <FooterContact>Contact</FooterContact>
        <FooterContents>
          <FooterInfo>
            Email
            <br />
            <FooterAnchor href={FOOTER.EMAIL.mailTo}>
              {FOOTER.EMAIL.base}
            </FooterAnchor>
          </FooterInfo>
          <FooterIcons>
            <li>
              <Image src='/images/icons/github.png' width={16} height={16} />
              <FooterAnchor href={FOOTER.GITHUB}>github</FooterAnchor>
            </li>
            <li>
              <Image src='/images/icons/instagram.png' width={16} height={16} />
              <FooterAnchor href={FOOTER.INSTAGRAM}>sns</FooterAnchor>
            </li>
          </FooterIcons>
          <FooterDescription>{FOOTER.DESCRIPTION}</FooterDescription>
        </FooterContents>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
