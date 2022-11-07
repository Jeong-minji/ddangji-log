import styled from "@emotion/styled";

import { MAIN_RESPONSIVE } from "../../lib/config/responsiveConfig";

export const ListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.figure * 3}px;
  padding: ${({ theme }) => theme.figure * 6}px 0;
  max-width: ${({ theme }) => theme.figure * 60}px;

  @media screen and (max-width: ${MAIN_RESPONSIVE.SM}px) {
    padding: ${({ theme }) => theme.figure * 12}px
      ${({ theme }) => theme.figure * 2}px;
    width: 100%;
    max-width: none;
  }
`;

export const ListTitle = styled.h2`
  color: ${({ theme }) => theme.colors.black_60};
  font-weight: 400;

  ${({ theme }) => theme.typography.text_md}
`;

export const ListBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.figure * 3}px;
`;
