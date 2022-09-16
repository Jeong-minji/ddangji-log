import styled from "@emotion/styled";

import { ROUTES } from "../../../lib/config/routeConfig";

export const MainContent = styled.div<{ path: string }>`
  ${({ theme, path }) =>
    !path.includes(ROUTES.POSTS) &&
    `
    display: flex;
    justify-content: center;
    gap: ${theme.figure * 10}px;
  `}
`;

export const Container = styled.div`
  width: ${({ theme }) => theme.figure * 6}rem;
`;
