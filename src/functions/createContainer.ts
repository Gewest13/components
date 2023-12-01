import { cloneElement, createElement, forwardRef, isValidElement } from "react";

export const createContainer = (Container: any) => {
  const ForwardComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    if (isValidElement(Container)) {
      return cloneElement(Container, { ...props });
    }

    return createElement(Container, { ...props, ref });
  })

  ForwardComponent.displayName = 'Container';

  return ForwardComponent;
}