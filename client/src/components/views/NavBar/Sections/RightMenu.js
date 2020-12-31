import React from 'react';
import {
  Heading,
  Badge,
  Center,
  Icon,
  Text,
  Button,
  CloseButton,
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
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import { FiLogIn } from 'react-icons/fi';
//import { FaShoppingCart } from 'react-icons/fa';
// import {
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
// } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
function RightMenu(props) {
  const user = useSelector((state) => state.user);
  //const total = user.userData && user.userData.cart.length;
  // set up logout
  const logoutHandler = () => {
    axios.get('http:localhost:8080/api/user/logout').then((response) => {
      if (response.status === 200) {
        props.history.push('/login');
      } else {
        // <Alert status="error">
        //   <AlertIcon />
        //   <AlertTitle mr={2}>Log Out Failed!</AlertTitle>
        //   <AlertDescription>Please try it again.</AlertDescription>
        //   <CloseButton position="absolute" right="8px" top="8px" />
        // </Alert>;
        alert('fail to log out');
      }
    });
  };
  // if the user is not auth route them with sign in register
  console.log(user, 'user');

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu>
        <MenuButton
          rightIcon={<ChevronDownIcon w={20} h={20} />}
          as={Button}
          color="#ff0000"
          margin="65px"
          px={26}
          py={8}
          borderRadius="20px"
          borderWidth="1px"
          borderColor="white"
          bg="white"
        >
          <Heading>Users</Heading>
        </MenuButton>
        <MenuList
          color="#ff0000"
          px={20}
          py={10}
          borderColor="white"
          borderRadius="10px"
          bg="#eddede"
          opacity={0.2}
        >
          <Link to="/login">
            <MenuItem
              rightIcon={<Icon as={FiLogIn} w={20} h={20} />}
              as={Button}
              color="#ff0000"
              margin="5px"
              px={26}
              py={8}
              borderRadius="20px"
              borderWidth="1px"
              borderColor="white"
              bg="white"
            >
              Login
            </MenuItem>
          </Link>
          <Link to="/register">
            <MenuItem
              rightIcon={<EditIcon w={20} h={20} />}
              as={Button}
              color="#ff0000"
              margin="5px"
              px={26}
              py={8}
              borderRadius="20px"
              borderWidth="1px"
              borderColor="white"
              bg="white"
            >
              Signup
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    );
  }
  // else route user to history cart and upload
  else {
    return (
      <div>
        <Center w="200px" bg="green.500">
          <Link color="red" href="/history">
            <Text>History</Text>
          </Link>
        </Center>
        <Center w="200px" bg="green.500">
          <Link color="red" href="/user/cart">
            <Text>Cart</Text>
          </Link>
        </Center>
        <Center w="200px" bg="green.500">
          <Link color="red" href="/product/upload">
            <Text>Upload</Text>
          </Link>
        </Center>
        <Center w="200px" bg="green.500">
          <Button onClick={logoutHandler}>Logout</Button>
        </Center>
      </div>
    );
  }
}
export default withRouter(RightMenu);
/**
 *  <Menu>
        <MenuButton
          rightIcon={<ChevronDownIcon w={20} h={20} />}
          as={Button}
          color="#ff0000"
          margin="65px"
          px={26}
          py={8}
          borderRadius="20px"
          borderWidth="1px"
          borderColor="white"
          bg="white"
        >
          <Heading>Welcome!</Heading>
        </MenuButton>
        <MenuList>
          <Link to="/history">
            <MenuItem>History</MenuItem>
          </Link>
          <Link to="/product/upload">
            <MenuItem>Upload</MenuItem>
          </Link>
          <Link to="/user/cart">
            <MenuItem>Cart </MenuItem>
          </Link>

          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList>
      </Menu>
 */
