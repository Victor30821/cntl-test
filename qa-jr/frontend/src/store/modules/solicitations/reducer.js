import { localizedStrings } from "constants/localizedStrings";

export const SOLICITATION_CHANGE_OPERATION_STATES = "solicitation_change_operation_states";
export const SOLICITATION_CREATE_SUCCESS = "solicitation_create_success";

export const SOLICITATION_LOAD_SUCCESS = "solicitation_load_success";

export const SOLICITATION_UPDATE_FAIL = "solicitation_update_fail";
export const SOLICITATION_EDIT_SUCCESS = "solicitation_edit_success";
export const SOLICITATION_UPDATE = "solicitation_update";
export const SOLICITATION_CHANGE_SELECTORS = "solicitation_change_selectors";

export const FETCH_ADDRESS_SUCCESS = 'fetch_address_success'
export const CHANGE_CURRENT_STEP = 'change_current_step';

const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  updateLoading: false,
}

const solicitationStatus = [
  {
    label: localizedStrings.allStatus,
    value: undefined,
  },
  {
    label: localizedStrings.solicitationStatus.pending,
    value: "pending",
  },
  {
    label: localizedStrings.solicitationStatus.approved,
    value: "approved",
  },
  {
    label: localizedStrings.solicitationStatus.recused,
    value: "recused",
  },
]

const INITIAL_STATE = {
  solicitations: [],
  total: 0,
  selectors: {},
  status: solicitationStatus,
  ...operationStates,
};

export default function solicitations(state = INITIAL_STATE, action) {
  const actionTypes = {
    change_current_step() {
      return {
        ...state,
        steps: state.steps.map((step, index) => {
          if (action.payload.stepIndex !== index) return {
            ...step,
            active: false,
            success: index < action.payload.stepIndex,

          };
          return {
            ...step,
            active: true,
            success: false,
          }
        })
      }
    },
    fetch_address_success() {
      return {
        ...state,
        searchedAddress: { ...action.payload.address },
      }
    },
    solicitation_change_selectors() {
      if (action.payload.reset) {
        return {
          ...state,
          selectors: {}
        }
      }
      return {
        ...state,
        selectors: {
          ...state.selectors,
          ...action.payload.selectors
        },
      };
    },
    solicitation_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    solicitation_create_success() {
      return {
        ...state,
        solicitations: [...state.solicitations, action.payload.solicitation],
      };
    },
    solicitation_load_success() {
      return {
        ...state,
        solicitations: action.payload.solicitations,
        approved: action.payload.approved,
        recused: action.payload.recused,
        pending: action.payload.pending,
        total: action.payload.total,
      };
    },
    solicitation_update_fail() {
      return {
        ...state,
        solicitations: action.editSolicitation(state.solicitations, action.payload)
      };
    },
    solicitation_edit_success() {
      return {
        ...state,
        solicitations: action.editSolicitation(state.solicitations, action.payload)
      };
    },
    solicitation_update() {
      return {
        ...state,
        solicitations: action.editSolicitation(state.solicitations, action.payload)
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
