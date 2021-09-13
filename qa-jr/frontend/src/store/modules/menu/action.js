
import {
    MENU,
    SELECT_CURRENT_SCREEN,
    SELECT_CHILD_SCREEN,
    SHOW_SCREENS
} from './reducer';

export function toggleMenu(menuIsOpen) {
    return {
        type: MENU,
        payload: {
            menuIsOpen
        }
    };
}
export function selectScreen(currentScreen) {
    return {
        type: SELECT_CURRENT_SCREEN,
        payload: {
            currentScreen
        }
    };
}
export function selectChildScreen(selectedChildrenScreen) {
    return {
        type: SELECT_CHILD_SCREEN,
        payload: {
            selectedChildrenScreen: {
                depthOne: selectedChildrenScreen.depthOne,
                depthTwo: selectedChildrenScreen.depthTwo,
            }
        }
    };
}
const editMenuScreens = ({
    menuScreens,
    showScreens,
}) => menuScreens?.filter(screen => showScreens.includes(screen.path));

export function showScreenToUser({ screens }) {
    return {
        type: SHOW_SCREENS,
        payload: {
            screens,
            editMenuScreens: editMenuScreens
        }
    };
};

export const enableScreens = data => async (dispatch) => {
    try {
        const {
            screens
        } = data;

        if (!Array.isArray(screens)) throw new Error('Error: screens is not an array');

        dispatch(showScreenToUser({ screens }));

    } catch (error) {
        console.log(error);
    }
}
