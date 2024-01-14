"use client"
import styled from 'styled-components';
import {Button, Input, Text} from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import {DotsIcon} from '../component/icons/accounts/dots-icon';
import {ExportIcon} from '../component/icons/accounts/export-icon';
import {InfoIcon} from '../component/icons/accounts/info-icon';
import {TrashIcon} from '../component/icons/accounts/trash-icon';
import {HouseIcon} from '../component/icons/breadcrumb/house-icon';
import {UsersIcon} from '../component/icons/breadcrumb/users-icon';
import {SettingsIcon} from '../component/icons/sidebar/settings-icon';
import {Flex} from '../component/styles/flex';
import {ProjectListWrapper} from '../component/projects/project-list';
import {AddProject} from '../component/projects/add-project';
import { Breadcrumbs, Crumb, CrumbLink } from '../component/breadcrumb/breadcrumb.styled';

/* eslint-disable-next-line */
export interface ProjectsProps {}

const StyledProjects = styled.div`
  color: pink;
`;

export default function Projects(props: ProjectsProps) {
  return (
    <Flex
       css={{
          'mt': '$5',
          'px': '$6',
          '@sm': {
             mt: '$10',
             px: '$16',
          },
       }}
       justify={'center'}
       direction={'column'}
    >
       <Breadcrumbs>
          <Crumb>
             <HouseIcon />
             <Link href={'/'}>
                <CrumbLink href="#">CDE</CrumbLink>
             </Link>
             <Text>/</Text>
          </Crumb>

          <Crumb>
             <UsersIcon />
             <CrumbLink href="#">Projects</CrumbLink>
             <Text>/</Text>
          </Crumb>
       </Breadcrumbs>

       <Text h3>All Projects</Text>
       <Flex
          css={{gap: '$8'}}
          align={'center'}
          justify={'between'}
          wrap={'wrap'}
       >
          <Flex
             css={{
                'gap': '$6',
                'flexWrap': 'wrap',
                '@sm': {flexWrap: 'nowrap'},
             }}
             align={'center'}
          >
             <Input
                css={{width: '100%', maxW: '410px'}}
                placeholder="Search projects"
             />
             <SettingsIcon />
             <TrashIcon />
             <InfoIcon />
             <DotsIcon />
          </Flex>
          <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
             <AddProject />
             <Button auto iconRight={<ExportIcon />}>
                Export to CSV
             </Button>
          </Flex>
       </Flex>

       <ProjectListWrapper />
    </Flex>
 );
}
