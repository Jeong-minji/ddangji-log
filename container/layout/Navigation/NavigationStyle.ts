import styled from "@emotion/styled";

import Anchor from "../../../components/common/Link/Anchor";
import { MAIN_RESPONSIVE } from "../../../lib/config/responsiveConfig";
import { Container } from "../LayoutMain/LayoutMainStyle";

export const NavigationWrapper = styled.nav`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  padding: ${({ theme }) => theme.figure / 2}px;
  width: 100%;
  z-index: 1000;
  border-top: 4px solid ${({ theme }) => theme.colors.black};
  border-bottom: 1px solid ${({ theme }) => theme.colors.black_10};
`;

export const NavigationContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavigationLogo = styled(Anchor)`
  ${({ theme }) => theme.typography.display_sm}

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.figure}px;
`;

export const NavigationSubWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.figure}px;
`;

export const NavigationAnchor = styled(Anchor)`
  ${({ theme }) => theme.typography.text_lg}

  @media screen and (max-width: ${MAIN_RESPONSIVE.XS}px) {
    ${({ theme }) => theme.typography.text_lg}
  }
`;
