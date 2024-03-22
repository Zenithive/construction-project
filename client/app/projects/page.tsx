"use client"
import React from 'react';
import {Flex} from '../component/styles/flex';
import {ProjectListWrapper} from '../component/projects/project-list';
import {AddProject} from '../component/projects/add-project';

/* eslint-disable-next-line */
export interface ProjectsProps {}

export default function Projects(props: ProjectsProps) {
   
   const [listRefresh, setListRefresh] = React.useState(false);

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
             
          </Flex>
          <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
             <AddProject setListRefresh={setListRefresh} />
          </Flex>
       </Flex>

       <ProjectListWrapper listRefresh={listRefresh} />
    </Flex>
 );
}
