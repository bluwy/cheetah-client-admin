import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import {
  AuthRouteGuardAdminIsInSessionQuery as IsInSessionQ,
  AuthRouteGuardAdminIsInSessionQueryVariables as IsInSessionV,
} from '/@/schema';
import RouteGuard, { RouteGuardProps } from './RouteGuard';

type AuthRouteGuardProps = Omit<RouteGuardProps, 'guard'>;

const IS_IN_SESSION = gql`
  query AuthRouteGuardAdminIsInSession {
    adminIsInSession
  }
`;

function AuthGuardedRoute(props: AuthRouteGuardProps) {
  const client = useApolloClient();

  const guard = async () => {
    const { data, error } = await client.query<IsInSessionQ, IsInSessionV>({
      query: IS_IN_SESSION,
      fetchPolicy: 'network-only',
    });

    return !data?.adminIsInSession || error != null;
  };

  return <RouteGuard {...props} guard={guard} />;
}

export default AuthGuardedRoute;
