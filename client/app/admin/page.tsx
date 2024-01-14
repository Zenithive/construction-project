"use client"
import styled from 'styled-components';
import {Accounts} from '../component/accounts/index';

/* eslint-disable-next-line */
export interface AdminProps {}

const StyledAdmin = styled.div`
  color: pink;
`;

export default function Admin(props: AdminProps) {
  return (
    <StyledAdmin>
      <Accounts pageTitle="Admin" />
    </StyledAdmin>
  );
}
