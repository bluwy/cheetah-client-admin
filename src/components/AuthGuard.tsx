import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import {
  AuthGuardAdminIsInSessionQuery as IsInSessionQ,
  AuthGuardAdminIsInSessionQueryVariables as IsInSessionV,
} from '/@/schema';
import { Redirect } from 'react-router-dom';

const IS_IN_SESSION = gql`
  query AuthGuardAdminIsInSession {
    adminIsInSession
  }
`;

// TODO: Use suspense
function AuthGuard({ children }: AuthGuardProps) {
  const { data, error, loading } = useQuery<IsInSessionQ, IsInSessionV>(IS_IN_SESSION, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <div />;
  }

  if (!data?.adminIsInSession || error != null) {
    return <Redirect to="/login" />;
  }

  return children;
}

type AuthGuardProps = PropTypes.InferProps<typeof AuthGuard.propTypes>;

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthGuard;
