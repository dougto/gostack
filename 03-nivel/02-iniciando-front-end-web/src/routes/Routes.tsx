import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface IRouteProps extends RouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const CustomRoute: React.FC<IRouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default CustomRoute;
