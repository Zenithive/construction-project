"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ReportsProps {}

const StyledReports = styled.div`
  color: pink;
`;

export default function Reports(props: ReportsProps) {
  return (
    <StyledReports>
      <h1>Welcome to Reports!</h1>
    </StyledReports>
  );
}
