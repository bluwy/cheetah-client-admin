import { TypePolicies } from '@apollo/client';
import { appTheme } from './vars';

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      appTheme: {
        read() {
          return appTheme();
        },
      },
    },
  },
};

export default typePolicies;
