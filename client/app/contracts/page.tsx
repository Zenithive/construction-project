"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ContractsProps {}

const StyledContracts = styled.div`
  color: pink;
`;

export default function Contracts(props: ContractsProps) {
  return (
    <StyledContracts>
      <h1>Welcome to Contracts!</h1>
    </StyledContracts>
  );
}
