import React, { useState } from 'react';

import RightMenu from './Sections/RightMenu';
import {
  Circle,
  Box,
  Text,
  Image,
  Center,
  Square,
  Heading,
  Badge,
  Spacer,
  Flex,
  Link,
} from '@chakra-ui/react';
import { FaRe, MenuItemgistered } from 'react-icons/fa';
import {
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from '@chakra-ui/react';

function NavBar() {
  return (
    <Flex h="170px">
      <Center size="200px">
        <Link color="red" href="/">
          <Image
            src="https://www.phimudelta.org/uploads/1/0/4/2/104275405/rutgers-logo_orig.gif"
            alt="RU"
            boxSize="200px"
          />
        </Link>
      </Center>
      <Spacer />
      <Center size="200px">
        <Link color="red" href="/">
          <Image
            src="https://github.com/lijiaxingogo/RUshrift/blob/main/rrr.png?raw=true"
            alt="RU"
            boxSize="250px"
          />
        </Link>
      </Center>
      <Spacer />
      <Center size="200px" bg="white" color="white">
        <RightMenu />
      </Center>
    </Flex>
  );
}

export default NavBar;
