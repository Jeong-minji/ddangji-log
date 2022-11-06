import styled from "@emotion/styled";

export const PostItemWrapper = styled.li`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover > img {
    transform: translateY(-4px);
    box-shadow: 0 10px 8px ${({ theme }) => theme.colors.black_10};
  }
`;

export const PostThumbnail = styled.img`
  border-radius: ${({ theme }) => theme.figure * 3}px;
  aspect-ratio: 2/1;
  object-fit: cover;
  transition: 0.3s;
`;

export const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme.figure / 2) * 3}px;
  padding: ${({ theme }) => theme.figure * 4}px 0;
`;

export const PostTitle = styled.p`
  color: ${({ theme }) => theme.colors.black_70};
  font-weight: 700;
  word-break: keep-all;
  white-space: pre-line;
  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.blue_light_2};
  }

  ${({ theme }) => theme.typography.display_sm}
`;

export const PostDescription = styled.span`
  color: ${({ theme }) => theme.colors.black_50};
  font-weight: 400;
  word-break: keep-all;
  white-space: pre-line;

  ${({ theme }) => theme.typography.text_md}
`;

export const PostDate = styled.span`
  color: ${({ theme }) => theme.colors.black_40};
  font-weight: 300;

  ${({ theme }) => theme.typography.text_sm}
`;
