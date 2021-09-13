import React, { useState, useEffect } from "react";
import { CardInput, Select, Col, Checkbox, Link } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row, Label } from "reactstrap";
import { ShowInformation } from "../style.js";
import { userChangeSelectors, loadGroups } from "store/modules";
import { useDispatch, useSelector } from "react-redux";
import { manager, defaultUser } from "constants/environment.js";
export default function Tab1({ initialValue, inputsConfig, user, onChanges, errors }) {

  const dispatch = useDispatch({});

  const {
    vehicles,
    loadLoading: vehiclesLoading,
    failLoading: vehiclesFail,
  } = useSelector((state) => state.vehicles);

  const {
    clients,
    loadLoading: clientsLoading,
    failLoading: clientsFail,
  } = useSelector((state) => state.clients);

  const {
    selectors
  } = useSelector(state => state.users);

  const {
    user: {
      role_id: loggedUserRole
    }
  } = useSelector(state => state.auth);
  const {
    loadLoading: groupsLoading,
    loadFail: groupsFail,
    groups
  } = useSelector(state => state.groups);

  const [visibleGroups, setVisibleGroups] = useState([]);

  const formatGroups = group => {
    return {
      label: group.tagName,
      value: group.tagName
    }
  }

  const [checkboxVehicle, setVehicleCheckbox] = useState(false);
  const [disableVehicleCheckbox, setDisableVehicleCheckbox] = useState(false);

  const [checkboxClient, setClientCheckbox] = useState(false);
  const [disableClientCheckbox, setDisableClientCheckbox] = useState(false);

	const [selectedGroups, setSelectedGroups] = useState([]);

  const [hasTypedEmail, setTypedEmail] = useState(false);

  const toggleClientsCheckbox = (data) => {
    setClientCheckbox(data);
    if (data) dispatch(userChangeSelectors({
      selectors: {
        clients: clients.map(client => ({
          label: client.company_name,
          value: client.id,
        }))
      }
    }))
  }
  const toggleVehiclesCheckbox = (data) => {
    setVehicleCheckbox(data);
    if (data) dispatch(userChangeSelectors({
      selectors: {
        vehicles: vehicles.map(vehicle => ({
          label: vehicle.name,
          value: vehicle.id,
        }))
      }
    }))
  }

  const selectsCustomStyles = {
    menu : () => ({
      border:"1px solid #1A227A"
    })
  }

	useEffect(() => {
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const selectedVehicles = vehicles.filter(vehicle => {
        return initialValue?.vehicles?.includes(vehicle.id);
      })
      dispatch(userChangeSelectors({
        selectors: {
          vehicles: selectedVehicles.map(vehicle => ({
            label: vehicle.name,
            value: vehicle.id,
          }))
        }
      }));
    }
    // eslint-disable-next-line
  }, [vehicles]);

  useEffect(() => {
    if (Array.isArray(clients) && clients.length > 0) {
      const selectedVehicles = clients.filter(client => {
        return initialValue?.clients?.includes(client.id);
      })
      dispatch(userChangeSelectors({
        selectors: {
          clients: selectedVehicles.map(client => ({
            label: client.company_name,
            value: client.id,
          }))
        }
      }));
    }
    // eslint-disable-next-line
  }, [clients]);

  useEffect(() => {
    const hasGroups = Array.isArray(groups) && groups.length > 0;

    if (hasGroups) setVisibleGroups(groups);

  }, [groups]);

  useEffect(() => {

    dispatch(loadGroups({}));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {

    if (vehicles?.length) {
      // manager has access to all vehicles
      const hasSelectedManager = selectors?.type?.value === manager;

      toggleVehiclesCheckbox(hasSelectedManager);
      setDisableVehicleCheckbox(hasSelectedManager)
    }
  // eslint-disable-next-line
  }, [selectors?.type, vehicles]);

	useEffect(() => {
		const has_groups =
			selectors?.groups?.length > 0 &&
			selectedGroups.length === 0 &&
			visibleGroups.length > 0;

		const groups_equals_visible_groups =
			has_groups &&
			selectors.groups.length === visibleGroups.length;

			if (groups_equals_visible_groups) {
				setSelectedGroups([{label: localizedStrings.allGroups, value: 0}]);
			}

			if (has_groups && !groups_equals_visible_groups) {
				setSelectedGroups(selectors.groups);
			}
	}, [selectedGroups, selectors, visibleGroups]);

  useEffect(() => {

    if (clients?.length) {
      // manager has access to all clients
      const hasSelectedManager = selectors?.type?.value === manager;

      toggleClientsCheckbox(hasSelectedManager);
      setDisableClientCheckbox(hasSelectedManager)
    }
  // eslint-disable-next-line
  }, [selectors?.type, clients]);

	const groupsChange  = (groupsArray) => {
		const has_groups_selected = groupsArray?.length > 0;

		const all_groups_is_the_last_element =
			has_groups_selected &&
			groupsArray[groupsArray.length - 1].value === 0;

		const all_groups_is_the_first_element =
			has_groups_selected &&
			groupsArray.length > 1 &&
			groupsArray[0].value === 0;

		const all_groups_not_selected =
			has_groups_selected &&
			!all_groups_is_the_last_element &&
			!all_groups_is_the_first_element;

		if(all_groups_is_the_last_element) {
			setSelectedGroups([groupsArray[groupsArray.length - 1]]);
			dispatch(
				userChangeSelectors({
					selectors: { groups: visibleGroups.map(formatGroups) },
				})
			);
		}

		if(all_groups_is_the_first_element) {
			setSelectedGroups([groupsArray[groupsArray.length - 1]]);
			dispatch(
				userChangeSelectors({
					selectors: { groups: [groupsArray[groupsArray.length - 1]] },
				})
			);
		}

		if(all_groups_not_selected) {
			setSelectedGroups(groupsArray);
			dispatch(
				userChangeSelectors({
					selectors: { groups: groupsArray },
				})
			);
		}

		if (!has_groups_selected) {
			setSelectedGroups([]);
			dispatch(
				userChangeSelectors({
					selectors: { groups: [] },
				})
			);
		}
	}

  return (
    <>
      <Row>
        <Col style={{padding: '0px 6px 0px 6px'}} md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleInput}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.name,
                name: "name",
                noMask: true,
                type: "text",
                required: true,
                placeholder: localizedStrings.name,
                defaultValue: user.name,
                error: errors.name.error,
                errorText: errors.name.message,
              },
            ]}
          />
        </Col>
        <Col style={{padding: '0px 6px 0px 6px'}} md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleInput}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.phone,
                name: "phone",
                type: "phone",
                required: true,
                placeholder: localizedStrings.phonePlaceholder,
                defaultValue: user.phone,
                error: errors.phone.error,
                errorText: errors.phone.message,
              },
            ]}
          />
        </Col>
      </Row>
      {!user?.ignore?.includes("language") &&
        !user?.ignore?.includes("country") && (
          <Row>
            <Col md="6" className="mb-6">
              <Select
                title={localizedStrings.language}
                required
                error={errors.language.error}
                errorText={errors.language.message}
                options={inputsConfig.inputs.languageOptions}
                placeholder={localizedStrings.selectAItem}
                onChange={(item) => {
                  dispatch(
                    userChangeSelectors({
                      selectors: { language: item },
                    })
                  );
                }}
                value={selectors?.language || {}}
              />
            </Col>
            <Col md="6" className="mb-6">
              <Select
                title={localizedStrings.country}
                required
                error={errors.country.error}
                errorText={errors.country.message}
                options={inputsConfig.inputs.countryOptions}
                placeholder={localizedStrings.selectAItem}
                onChange={(item) => {
                  dispatch(
                    userChangeSelectors({
                      selectors: { country: item },
                    })
                  );
                }}
                value={selectors?.country || {}}
              />
            </Col>
          </Row>
        )}
      <Row>
        {(loggedUserRole !== defaultUser ||
          (user?.ignore && !user?.ignore?.includes("hierarchy"))) && (
          <Col md="6" className="mb-6">
            <Select
              title={localizedStrings.hierarchy}
              required
              error={errors.type.error}
              errorText={errors.type.message}
              options={inputsConfig.inputs.typeOptions}
              placeholder={localizedStrings.selectAItem}
              customStyle={selectsCustomStyles}
              onChange={(item) => {
                dispatch(
                  userChangeSelectors({
                    selectors: { type: item },
                  })
                );
              }}
              showHelpTooltip={true}
              helpTooltipMessage={[
                localizedStrings.tooltipHelpTexts.hierarchy.text,
                <Link
                  href={localizedStrings.tooltipHelpTexts.hierarchy.link}
                  target="_blank"
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>,
              ]}
              value={selectors?.type || {}}
            />
          </Col>
        )}
        {(loggedUserRole !== defaultUser ||
          (user?.ignore && !user?.ignore?.includes("groups"))) && (
          <Col md="6" className="mb-6">
            <Select
              title={localizedStrings.groups}
              isMulti
              errorText={errors.type.message}
              placeholder={localizedStrings.selectAGroup}
              onChange={(value) => groupsChange(value)}
              value={selectedGroups}
              error={groupsFail}
              loading={groupsLoading}
              options={[{label: localizedStrings.allGroups, value: 0}, ...visibleGroups.map(formatGroups)]}
              emptyStateText={localizedStrings.noGroupCreated}
							showHelpTooltip={true}
              helpTooltipMessage={[
                localizedStrings.tooltipHelpTexts.group.text,
                <Link
                  href={localizedStrings.tooltipHelpTexts.group.link}
                  target="_blank"
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>,
              ]}
            />
          </Col>
        )}
      </Row>
      {inputsConfig.pageEdit && (
        <>
          <Row>
            <Col style={{padding: '0px 6px 0px 6px',marginBottom: 10}} md="6" className="mb-6">
              <CardInput
                onChange={onChanges.handleInput}
                register={inputsConfig.register}
                inputs={[
                  {
                    label: localizedStrings.password,
                    name: "password",
                    type: "password",
                    noMask: true,
                    required: false,
                    defaultValue: user.password,
                    error: errors.password.error,
                    errorText: errors.password.message,
                  },
                ]}
              />
            </Col>
            <Col style={{padding: '0px 6px 0px 6px', marginBottom: 10}} md="6" className="mb-6">
              <CardInput
                onChange={onChanges.handleInput}
                register={inputsConfig.register}
                inputs={[
                  {
                    label: localizedStrings.passwordRepeat,
                    name: "passwordRepeat",
                    type: "password",
                    noMask: true,
                    required: false,
                    defaultValue: user.passwordRepeat,
                    error: errors.passwordRepeat.error,
                    errorText: errors.passwordRepeat.message,
                  },
                ]}
              />
            </Col>
          </Row>
        </>
      )}
      {!user?.ignore?.includes("vehicles") && (
        <Row>
          <Col xxs="6" sm="6" md="6" className="mb-6">
            <Select
              title={localizedStrings.allowedVehicles}
              required={false}
              isMulti
              disabled={checkboxVehicle}
              options={
                vehicles?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) || []
              }
              loading={vehiclesLoading}
              error={vehiclesFail}
              placeholder={localizedStrings.selectAVehicle}
              onChange={(item) => {
                dispatch(
                  userChangeSelectors({
                    selectors: { vehicles: item },
                  })
                );
              }}
              value={selectors?.vehicles || []}
              emptyStateText={localizedStrings.noVehicleCreated}
            />
          </Col>
          <Col
            style={{ display: "flex", alignItems: "center" }}
            xxs="6"
            sm="6"
            md="6"
            className="mb-6"
          >
            <Label>
              <Checkbox
                title={localizedStrings.selectAllVehicles}
                disabled={
                  vehiclesLoading || vehiclesFail || disableVehicleCheckbox
                }
                onChange={toggleVehiclesCheckbox}
                checked={checkboxVehicle}
              />
            </Label>
          </Col>
        </Row>
      )}
      {!user?.ignore?.includes("clients") && (
        <Row>
          <Col xxs="6" sm="6" md="6" className="mb-6">
            <Select
              title={localizedStrings.allowedClients}
              required={false}
              isMulti
              disabled={checkboxClient}
              options={
                clients?.map((item) => ({
                  label: item.company_name,
                  value: item.id,
                })) || []
              }
              loading={clientsLoading}
              error={clientsFail}
              placeholder={localizedStrings.selectAClient}
              onChange={(item) => {
                dispatch(
                  userChangeSelectors({
                    selectors: { clients: item },
                  })
                );
              }}
              value={selectors?.clients || []}
              emptyStateText={localizedStrings.noClientCreated}
            />
          </Col>
          <Col
            style={{ display: "flex", alignItems: "center" }}
            xxs="6"
            sm="6"
            md="6"
            className="mb-6"
          >
            <Label>
              <Checkbox
                title={localizedStrings.selectAllClients}
                disabled={
                  clientsLoading || clientsFail || disableClientCheckbox
                }
                onChange={toggleClientsCheckbox}
                checked={checkboxClient}
              />
            </Label>
          </Col>
        </Row>
      )}

      <Row>
        <Col style={{ padding: '0px 6px 0px 6px' }} md="6" className="mb-6">
          <CardInput
            onChange={(field, value) => {
              onChanges.handleInput(field, value);
              if (inputsConfig.pageEdit) return;
              const hasValue = !!inputsConfig?.watch?.("email")?.length;

              if (hasTypedEmail !== hasValue) setTypedEmail(hasValue);
            }}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.email,
                name: "email",
                noMask: true,
                type: "email",
                required: true,
                placeholder: localizedStrings.email,
                defaultValue: user.email,
                error: errors.email.error,
                errorText: errors.email.message,
              },
            ]}
          />
        </Col>
        {!inputsConfig.pageEdit
          ? hasTypedEmail && (
              <Col md="6" className="mb-6">
                <ShowInformation>
                  <span>
                    {
                      <b>
                        {localizedStrings.userDefaultPassword(
                          inputsConfig?.watch?.("email")?.split("@").shift()
                        )}
                      </b>
                    }
                    {localizedStrings.userShowInformation}
                  </span>
                </ShowInformation>
              </Col>
            )
          : !!user.last_access && (
              <Col md="6" className="mb-6">
                <CardInput
                  register={inputsConfig.register}
                  inputs={[
                    {
                      label: localizedStrings.lastAccess,
                      name: "lastAccess",
                      type: "text",
                      defaultValue: user.last_access,
                      readOnly: true,
                    },
                  ]}
                />
              </Col>
            )}
      </Row>
    </>
  );
}
