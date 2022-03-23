import styled from "styled-components";

export const Info = ({ info }) => {
  const { title, discription } = info;

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Discription>{discription}</Discription>
    </Wrapper>
  );
};

export default Info;

const Wrapper = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 4.5rem;
  font-weight: bold;
  letter-spacing: -3px;
`;

const Discription = styled.p`
  padding: 0.5rem 1rem;
  border-left: 5px solid ${({ theme }) => theme.navy};
  background-color: #fcfcfc;
  color: ${({ theme }) => theme.lightgray};

  a {
    font-weight: 700;
  }

  strong {
    font-weight: bold;
  }

  a:hover {
    color: ${({ theme }) => theme.navy};
    transition: 0.3s;
  }
`;
