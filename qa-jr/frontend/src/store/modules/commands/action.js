import {
    COMMANDS_CREATE_FAIL,
    COMMANDS_CREATE,
    COMMANDS_CREATE_SUCCESS,
    COMMANDS_LOAD_SUCCESS,
    COMMANDS_UPDATE_SUCCESS,
    COMMANDS_UPDATE_FAIL,
    COMMANDS_UPDATE,
    COMMANDS_CHANGE_OPERATION_STATES,
    COMMANDS_LOAD,
    LIST_TYPE_COMMANDS
} from './reducer';
import qs from 'qs'
import { api, mapApi } from 'services/api'
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
import getSignalType from 'utils/getSignalType';
import { vehicleOn } from 'constants/environment';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const editExistingCommands = (commands, newCommands) => {
    return commands.map(command => {
        if (command.id === newCommands.command.id) {
            command = { ...command, ...newCommands.command }
        }
        return command;
    })
}

export function commandUpdateSuccess(command) {
    return {
        type: COMMANDS_UPDATE_SUCCESS,
        editCommands: editExistingCommands,
        payload: {
            command
        }
    };
}

export function trackersCommandsLoad({ type_commands }) {
    return {
        type: COMMANDS_LOAD,
        payload: {
            type_commands
        }
    };
}

export function commandUpdate({ commands }) {
    return {
        type: COMMANDS_UPDATE,
        payload: {
            commands
        }
    };
}
export function commandsChangeOperationStates({
    updateLoading = false,
    deleteLoading = false,
    deleteSuccess = false,
    deleteFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: COMMANDS_CHANGE_OPERATION_STATES,
        payload: {
            updateLoading,
            deleteLoading,
            deleteSuccess,
            deleteFail,
            editLoading,
            editSuccess,
            editFail,
            createLoading,
            createSuccess,
            createFail,
            loadLoading,
            loadSuccess,
            loadFail,
        }
    };
}

export function commandUpdateFail(command) {
    return {
        type: COMMANDS_UPDATE_FAIL,
        editCommands: editExistingCommands,
        payload: {
            command
        }
    };
}
export function commandsLoadSuccess({ commands, total }) {
    return {
        type: COMMANDS_LOAD_SUCCESS,
        payload: {
            commands: commands,
            total,
        }
    };
}


export function commandCreateSuccess({ command }) {
    return {
        type: COMMANDS_CREATE_SUCCESS,
        payload: {
            command
        }
    };
}
export function commandCreateFail() {
    return {
        type: COMMANDS_CREATE_FAIL,
    };
}
export function commandCreate({ commands }) {
    return {
        type: COMMANDS_CREATE,
        payload: {
            commands
        }
    };
}

export function listTypeCommand({ commands }) {
    return {
        type: LIST_TYPE_COMMANDS,
        payload: {
            commands
        }
    };
}

export const loadTrackersCommands = data => async dispatch => {
    dispatch(commandsChangeOperationStates({ loadLoading: true }));
    try {
        const URL = "/command/v1/types";
        const {
            data: { type_commands }
        } = await api.get(URL);

        dispatch(trackersCommandsLoad({ type_commands }));

        dispatch(commandsChangeOperationStates({ loadSuccess: true }));
    } catch (e) {
        console.log(e);
        dispatch(commandsChangeOperationStates({ loadFail: true }));
    }
}


export const loadCommands = data => async dispatch => {
    dispatch(commandsChangeOperationStates({ loadLoading: true }));
    try {
        const params = [];
        const filters = {
            organization_id: val => val && params.push("organization_id=" + val),
            limit: val => val && params.push("limit=" + val),
            offset: (val = 0) => params.push("offset=" + val),
            search_term: val => val && params.push("search_term=" + val),
            sort: val => val && params.push("sort=" + val),
        }

        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        const URL = "/command/v1?" + params.join("&");
        const {
            data: { commands, total }
        } = await api.get(URL);
        
        const convert_type_command_id = {
            '1': localizedStrings.blockCommand.toLowerCase(),
            '3': localizedStrings.blockCommand.toLowerCase(),
            '5': localizedStrings.blockCommand.toLowerCase(),
            '2': localizedStrings.unblockCommand.toLowerCase(),
            '4': localizedStrings.unblockCommand.toLowerCase(),
            '6': localizedStrings.unblockCommand.toLowerCase(),
            '7': localizedStrings.failToUpdateOdometer.toLowerCase(),
            '8': localizedStrings.failToUpdateOdometer.toLowerCase(),
            '9': localizedStrings.failToUpdateOdometer.toLowerCase(),
        }

        const convert_status_commands = {
            0: (type_command_id) => localizedStrings.pendent,
            1: (type_command_id) => localizedStrings.pendent,
            2: (type_command_id) => localizedStrings.sended,
            3: (type_command_id) => localizedStrings.executed,
            4: (type_command_id) => localizedStrings.failTo + convert_type_command_id[type_command_id],
        };

        const commands_without_odometer = commands
					.filter(
						(command) =>
							command.type_command_id !== 7 &&
							command.type_command_id !== 8 &&
							command.type_command_id !== 9
					)
					.map((command) => ({
						...command,
						status_converted: convert_status_commands[command.status](
							command.type_command_id
						),
					}))
					.reverse();

        dispatch(commandsLoadSuccess({
            commands: commands_without_odometer,
            total
        }));

        dispatch(commandsChangeOperationStates({ loadSuccess: true }));

    } catch (error) {
        console.log(error);
        dispatch(commandsChangeOperationStates({ loadFail: true }));
    }
};



export const requestDeleteConfirmation = async (dataString = "<Dado a Ser Deletado>", successMessage = "<Mensagem de sucesso>") => {
    try {
        const { isConfirmed } = await MySwal.fire({
            html: [
                    "<div style= 'padding: 0px 12px'>"+
                        "<p style='font-weight: bolder; font-size: 28px; padding: 0px 24px'>"+localizedStrings.areYouSureDeleteThis+"</p>"+
                        "<div style='font-size: 14px; padding: 20px 12px 5px 12px; line-height:25px'>"+ 
                            "<p style='padding: 0px 30px'>"+localizedStrings.thisActionNotIsReversive.thisAction+" "+
                                                            dataString.toLowerCase()+ " " +
                                                            localizedStrings.thisActionNotIsReversive.notIsReversive+
                            "</p>"+
                            "<p>"+localizedStrings.doYouWantToProceed +"</p>"+
                        "</div>"+
                    "</div>"
                    ],
                    icon: 'error',
                    iconHtml: "!",
                    iconHeight: 120,
                    cancelButtonText: localizedStrings.no,
                    confirmButtonText: localizedStrings.yes,
                    showCancelButton: true,
                    showConfirmButton: true,
                    reverseButtons: true,
                    confirmButtonColor: "#1a2565",
                    width: 390,
                    height: 414, 
        })

        isConfirmed ? 
            toast.success(successMessage)
            : toast.error(localizedStrings.operationCanceled)

        return isConfirmed
    } catch (error) {
        console.log(error);
        return false
    }
}

const requestUserConfirmation = async () => {
    try {
        const { isConfirmed } = await MySwal.fire({
            title: localizedStrings.vehicleIsInShadowArea,
            text: localizedStrings.areYouSureUWantToSendCommandToThisVehicle,
            icon: 'warning',
            confirmButtonText: localizedStrings.yes,
            cancelButtonText: localizedStrings.no,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: "#1a2565"
        })

        return isConfirmed
    } catch (error) {
        console.log(error);
        return false
    }
}
export const createCommand = data => async dispatch => {
    const URL = "/command/v1/";

    const create_odometer_value = {
        8: ({ value }) => value * 1000,
        default: ({ value }) => value,
    }

    const params = {
        commands:
            data.vehicles.map(vehicle => ({
                organization_id: data.organization_id || vehicle.organization_id,
                vehicle_id: vehicle.vehicle_id || vehicle.value,
                type_command_id: vehicle.command_id,
                value: create_odometer_value?.[vehicle?.command_id]?.({ value: vehicle?.value }) || create_odometer_value?.default?.({ value: vehicle?.value }),
                status: 1,
                label_code: vehicle.label_code,
                is_system: 1,
                sent_command: vehicle.sent_command,
            }))
    }

    const rollbackData = data.vehicles.map(vehicle => ({
        vehicle_name: vehicle.label,
        type_command_name: vehicle.command_name,
        status: 1,
        created: new Date(),
        modified: new Date(),
    }))

    if (data.requestUserConfirmation) {
        dispatch(commandsChangeOperationStates({ createLoading: true }));

        const vehiclesIds = params.commands.map(vehicle => vehicle.vehicle_id).join()

        const {
            data: { last_points = {} }
        } = await mapApi.get("/api/v1/last-points", {
            params: {
                vehicle_id: vehiclesIds,
                limit: true
            }
        });

        const hasMoreThanOneVehicle = Array.isArray(last_points);

        const vehiclesInfo = hasMoreThanOneVehicle ? last_points : [last_points]

        const isUnwantedVehicle = point => vehicleOn !== getSignalType({...point.last_positions, stage_vehicle_id: point?.vehicle?.stage_vehicle_id} || {})

        const hasAnyVehicleWithUnwantedStatus = vehiclesInfo.some(isUnwantedVehicle);

        const blockAndUnlockCommands = ["desbloquear", "bloquear"];

        const hasBlockOrUnlockCommands = data.vehicles.some((vehicle = {}) => blockAndUnlockCommands.includes(vehicle.command_name.toLowerCase()));

        const hasToRequestConfirmation = hasBlockOrUnlockCommands && hasAnyVehicleWithUnwantedStatus;


        await dispatch(commandsChangeOperationStates({}));

        if (hasToRequestConfirmation) {
            const confirmed = await requestUserConfirmation();
            if (!confirmed) return;
        }
    }

    dispatch(commandCreate({ commands: rollbackData }));

    try {
        !data?.ignoreToast && toast.info(localizedStrings.pending.create.command);
        const {
            data: { commands }
        } = await api.post(URL, qs.stringify(params))
        dispatch(commandUpdate({ commands, }));
        dispatch(commandsChangeOperationStates({}));

        !data?.ignoreToast && toast.success(localizedStrings.success.create.command);
    } catch (error) {
        !data?.ignoreToast && toast.error(localizedStrings.error.create.command);
        dispatch(commandCreateFail());
        dispatch(commandsChangeOperationStates({ createFail: true, }));
    }

};

export const listTypeCommands = data => async dispatch => {
    try {
        const URL = "/command/v1/types ";
        const {
            data: { type_commands }
        } = await api.get(URL);
        dispatch(listTypeCommand({ commands: type_commands }));
    } catch (error) {
        console.log(error)
    }
};
