"use client"
import styled from 'styled-components';
import {Users} from '../component/users/index';
import {Organisations} from '../component/organisations/index';
import { Box, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

/* eslint-disable-next-line */
export interface AdminProps {}

const StyledAdmin = styled.div`
  color: pink;
`;

export default function Admin(props: AdminProps) {
  const [currentTab, setCurrentTab] = useState(0 as number);
  const handleChange = (event:SyntheticEvent<Element, Event>, value: number)=>{
    console.log(value)
    setCurrentTab(value);
  }
  return (
    <StyledAdmin>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', justifyContent:'end', display:'flex' }}>
        <Tabs value={currentTab} onChange={handleChange} aria-label="basic tabs example" >
          <Tab label="Users" />
          <Tab label="Organisations"  />
        </Tabs>
      </Box>

      {currentTab == 0 && <Users />}
      {currentTab == 1 && <Organisations />}

    </StyledAdmin>
  );
}
