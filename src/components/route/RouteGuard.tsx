import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

type Promisable<T> = T | Promise<T>;

type GuardIfFn = string | (() => (string | void));

export interface RouteGuardProps {
  children?: React.ReactNode
  guard: () => Promisable<boolean>
  ifPass?: GuardIfFn
  ifFail?: GuardIfFn
}

function handleIfFn(fn?: GuardIfFn) {
  return typeof fn === 'function' ? fn() : fn;
}

function RouteGuard(props: RouteGuardProps) {
  const {
    children,
    guard,
    ifPass,
    ifFail,
  } = props;

  const history = useHistory();
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    setAllow(false);

    const guardResult = guard();

    const handleGuardResult = (result: boolean) => {
      const redirectPath = result ? handleIfFn(ifFail) : handleIfFn(ifPass);

      if (redirectPath != null) {
        history.replace(redirectPath);
      } else {
        setAllow(true);
      }
    };

    if (guardResult instanceof Promise) {
      guardResult.then(handleGuardResult);
    } else {
      handleGuardResult(guardResult);
    }
  }, [guard]);

  if (!allow) {
    return <div />;
  }

  // There's a weird History.UnknownFacade return type if below didn't cast
  return children as JSX.Element;
}

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
  guard: PropTypes.func.isRequired,
  ifPass: PropTypes.string,
  ifFail: PropTypes.string,
};

RouteGuard.defaultProps = {
  ifPass: undefined,
  ifFail: undefined,
};

export default RouteGuard;
