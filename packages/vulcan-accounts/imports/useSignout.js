import { useApolloClient } from '@apollo/react-hooks';

/**
 *  Hook used to sign the user out.
 *
 * @param {function} callback called after the logout and the Apollo store reset
 * @returns {function} a function to execute when you log the user out
 */

const useSignOut = (callback = () => {}) => {
  const client = useApolloClient();
  return () =>
    Meteor.logout(() => {
      const resetStoreCallback = () => {
        callback();
        removeResetStoreCallback(resetStoreCallback);
      };
      const removeResetStoreCallback = client.onResetStore(resetStoreCallback);
      client.resetStore();
    });
};

export default useSignOut;
