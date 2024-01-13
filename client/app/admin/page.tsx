"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface AdminProps {}

const StyledAdmin = styled.div`
  color: pink;
`;

export default function Admin(props: AdminProps) {
  return (
    <StyledAdmin>
      <h1>Welcome to Admin!</h1>
    </StyledAdmin>
  );
}
