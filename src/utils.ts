/* eslint-disable import/prefer-default-export */
import { useLocation } from 'react-router-dom';

export function useLocationQuery() {
  return new URLSearchParams(useLocation().search);
}
