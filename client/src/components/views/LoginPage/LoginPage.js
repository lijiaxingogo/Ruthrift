import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Heading,
  Flex,
  Text,
  Center,
  InputGroup,
  InputLeftAddon,
  ButtonGroup,
  Container,
  Header,
  useToast,
  CloseButton,
  InputRightElement,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { MailOutlined } from '@ant-design/icons';
import { Form, Input, Icon, Button, Checkbox, Typography } from 'antd';
import React, { useState } from 'react';
import { loginUser } from '../../../_actions/user_actions';
// formik for form
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
const LoginPage = (props) => {
  console.log('whats the props is', props);
  const dispatch = useDispatch();
  const initialEmail = localStorage.getItem('rememberMe')
    ? localStorage.getItem('rememberMe')
    : '';
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState('');
  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  return (
    <Formik
      initialValues={{ email: initialEmail }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        // submit the form with data from values
        // dispatch the action to upstate the state
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };
          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.id);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push('/');
              } else {
                setFormErrorMessage('Wrong Account or Password!');
              }
            })
            .catch((err) => {
              setFormErrorMessage('Check out your Account or Password again');
              setTimeout(() => {
                setFormErrorMessage('');
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmiting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <Container maxW="max" maxH="max">
            <Center pt="40px" pb="800px">
              <Flex
                direction="column"
                align="center"
                bg="#e8e8e8"
                color="black"
                width="450px"
                borderRadius="8px"
                padding="30px"
                justify="center"
              >
                <form onSubmit={handleSubmit} style={{ width: '350px' }}>
                  <Form.Item required>
                    <Input
                      id="email"
                      prefix={<EmailIcon />}
                      placeholder="Enter your email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </Form.Item>

                  <Form.Item required>
                    <Input
                      id="password"
                      prefix={<LockIcon />}
                      placeholder="Enter your password"
                      type="password"
                      value={values.password}
                      onchange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                  </Form.Item>
                  {formErrorMessage && (
                    <label>
                      <p
                        style={{
                          color: '#ff0000bf',
                          fontSize: '0.7rem',
                          border: '1px solid',
                          padding: '1rem',
                          borderRadius: '10px',
                        }}
                      >
                        {formErrorMessage}
                      </p>
                    </label>
                  )}
                  <Form.Item>
                    <Checkbox
                      id="rememberMe"
                      onChange={handleRememberMe}
                      checked={rememberMe}
                    >
                      Remember me
                    </Checkbox>
                    <a
                      className="login-form-forgot"
                      href="/reset_user"
                      style={{
                        float: 'right',
                        textDecoration: 'underline black',
                        fontSize: '12px',
                      }}
                    >
                      forgot password
                    </a>
                    <div>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        shape="round"
                        style={{ minWidth: '100%' }}
                        disabled={isSubmitting}
                        onSubmit={handleSubmit}
                      >
                        Log in
                      </Button>
                    </div>
                  </Form.Item>
                </form>
              </Flex>
            </Center>
          </Container>
        );
      }}
    </Formik>
  );
};
export default LoginPage;
