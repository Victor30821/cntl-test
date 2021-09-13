

export const COMMANDS_CREATE_FAIL = "commands_create_fail";
export const COMMANDS_CREATE = "commands_create";
export const COMMANDS_CREATE_SUCCESS = "commands_create_success";
export const COMMANDS_LOAD_SUCCESS = "commands_load_success";
export const COMMANDS_LOAD_TAGGING_BY_NAME_SUCCESS = "commands_load_tagging_by_name_success";
export const COMMANDS_UPDATE_SUCCESS = "commands_update_success";
export const COMMANDS_LOAD = "commands_load";

export const COMMANDS_UPDATE = "commands_update";
export const COMMANDS_UPDATE_FAIL = "commands_update_fail";

export const COMMANDS_CHANGE_OPERATION_STATES = "commands_change_operation_states";
export const LIST_TYPE_COMMANDS = "list_type_commands";

const operationStates = {
  updateLoading: false,
  updateFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  commands: [],
  trackersCommands: [],
  total: 0,
  ...operationStates
};

export default function commands(state = INITIAL_STATE, action) {
  const actionTypes = {
    list_type_commands() {
      return {
        ...state,
        listCommands: action.payload.commands,
      };
    },
    commands_create_fail() {
      const commands = JSON.parse(JSON.stringify(state.commands));
      return {
        ...state,
        commands: commands.filter(command => command.id)
      };
    },
    commands_create() {
      // eslint-disable-next-line
      action.payload.commands.map(command => {
        state.commands.splice(0, 0, command);
      })
      return {
        ...state,
        commands: state.commands,
      };
    },
    commands_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    commands_load_success() {
      return {
        ...state,
        commands: action.payload.commands,
        total: action.payload.total,
      };
    },
    commands_load() {
      return {
        ...state,
        trackersCommands: action.payload.type_commands
      };
    },
    commands_update() {
      const commands = JSON.parse(JSON.stringify(state.commands));
      // eslint-disable-next-line
      action.payload.commands.map(command => {
        commands.splice(0, 0, command);
      })

      return {
        ...state,
        commands: commands.filter(command => command.id)
      };
    },
    commands_update_success() {
      return {
        ...state,
        commands: action.editCommands(state.commands, action.payload)
      };
    },

    commands_update_fail() {
      return {
        ...state,
        commands: action.editCommands(state.commands, action.payload)
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}

