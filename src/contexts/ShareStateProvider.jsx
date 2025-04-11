import { useState } from 'react';
import { createContainer } from 'react-tracked';

/**
 * Set initial state here if needed by app
 */
const initialState = {
  showCurtains: false,
};

const useMyState = () => useState(initialState);

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useMyState);