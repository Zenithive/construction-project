"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface DeliverablesProps {}

const StyledDeliverables = styled.div`
  color: pink;
`;

export default function Deliverables(props: DeliverablesProps) {
  return (
    <StyledDeliverables>
      <h1>Welcome to Deliverables!</h1>
    </StyledDeliverables>
  );
}
