import { act, create } from 'react-test-renderer';

const getTestUtils = ({ dispatch, subscribe, getState }, defTimeout = 200) => {
    const waitForState = (testCode, asserts, t = defTimeout) => act(() => new Promise((resolve, reject) => {
        let lastError = null;
        let unsubscribe;
        let tId = setTimeout(() => {
            tId = null;
            unsubscribe();
            if (lastError) {
                reject(lastError);
            } else {
                resolve();
            }
        }, t);
        unsubscribe = subscribe(() => {
            if (tId === null) {
                return;
            }
            try {
                const state = getState();
                while (asserts.length > 0) {
                    asserts[0](state);
                    asserts.shift();
                }
                clearTimeout(tId);
                unsubscribe();
                resolve();
            } catch (e) {
                lastError = e;
            }
        });
        testCode();
    }));

    const checkDispatch = async (action, asserts) => waitForState(
        () => dispatch(action),
        (Array.isArray(asserts) ? asserts : [asserts])
            .map((assert) => (state) => assert(expect(state))),
    );

    return {
        waitForState,
        checkDispatch,
    };
};

export { getTestUtils, create };
