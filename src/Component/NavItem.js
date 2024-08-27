import styled from "styled-components";

const Container = styled.div`
  width: fit-content;
  height: 120px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  span {
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

export function NavItem({ name }) {
  return (
    <>
      <Container>
        <span>{name}</span>
      </Container>
    </>
  );
}
