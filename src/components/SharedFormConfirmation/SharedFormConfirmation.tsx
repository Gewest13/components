import React, { useEffect, useState } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from './SharedFormConfirmation.module.scss';

export interface SharedFormConfirmationProps {
  confirmation: {
    id: number;
  }
  transitionGroup?: {
    customClassNames?: {
      transitionGroup: string;
      cssTransition: string;
    }
    timeout?: {
      enter: number;
      exit: number;
    }
  }
  debug?: boolean;
  confirmationTimeout?: number;
  children: React.ReactNode;
}

/**
 * `SharedFormConfirmation` is a React component that handles the display of confirmation messages.
 *
 * @param {object} data - The properties for the component.
 * @param {object} data.confirmation - An object containing the id of the confirmation message.
 * @param {object} [data.transitionGroup] - An optional object for customizing the transition group.
 * @param {object} [data.transitionGroup.customClassNames] - An optional object for customizing the class names of the transition group and CSS transition.
 * @param {object} [data.transitionGroup.timeout] - An optional object for customizing the enter and exit timeouts of the transition group.
 * @param {boolean} [data.debug] - An optional boolean for enabling debug mode.
 * @param {number} [data.confirmationTimeout=3000] - An optional number for setting the timeout of the confirmation message. Defaults to 3000 milliseconds.
 * @param {React.ReactNode} data.children - The child elements to be rendered within the component.
 *
 * @returns {React.ReactElement} The rendered React element.
 *
 * @example
 * // Display a confirmation message with a custom transition group and timeout
 * <SharedFormConfirmation
 *   confirmation={{ id: 1 }}
 *   transitionGroup={{
 *     customClassNames: {
 *       transitionGroup: 'custom-transition-group',
 *       cssTransition: 'custom-css-transition',
 *     },
 *     timeout: {
 *       enter: 500,
 *       exit: 500,
 *     },
 *   }}
 *   confirmationTimeout={2000}
 * >
 *   <div>Confirmation message content</div>
 * </SharedFormConfirmation>
 *
 * // TODO: Add event to remove the clicked confirmation
 */
export function SharedFormConfirmation(data: SharedFormConfirmationProps) {
  const { transitionGroup, confirmation, debug, confirmationTimeout = 1000 * 3, children } = data;

  const [confirmations, setConfirmations] = useState<{ id: number }[]>([]);

  useEffect(() => {
    if (confirmation.id === 0) return;

    const newPopup = { id: confirmation.id }

    setConfirmations((prevConfirmations) => [...prevConfirmations, newPopup]);

    if (debug) return;

    setTimeout(() => {
      setConfirmations((prevConfirmations) => prevConfirmations.filter((popup) => popup.id !== newPopup.id));
    }, confirmationTimeout);
  }, [confirmation]);

  return (
    <TransitionGroup className={transitionGroup?.customClassNames?.transitionGroup || styles.transition}>
      {confirmations.map((confirmation) => (
        <CSSTransition key={confirmation.id} timeout={transitionGroup?.timeout || 500} classNames={transitionGroup?.customClassNames?.cssTransition || "message"}>
          {children}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
