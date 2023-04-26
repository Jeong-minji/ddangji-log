import styled from "@emotion/styled";
import Anchor from "../../../components/common/Link/Anchor";
import { Container } from "../LayoutMain/LayoutMainStyle";

export const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: ${({ theme }) => theme.figure * 3}px;
  border-top: 1px solid ${({ theme }) => theme.colors.black_10};
  background-color: rgb(253, 253, 253);
`;

export const FooterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.figure * 2}px;
`;

export const FooterContact = styled.p`
  ${({ theme }) => theme.typography.text_lg}
`;

export const FooterContents = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.figure * 7}px;
  color: ${({ theme }) => theme.colors.black_50};
`;

export const FooterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.figure - 2}px;
`;

export const FooterIcons = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.figure + 2}px;
  }
`;

export const FooterDescription = styled.p`
  flex: 1;
  line-height: 1.6;
`;

export const FooterAnchor = styled(Anchor)`
  padding: 0;
  color: ${({ theme }) => theme.colors.blue_custom};
`;
