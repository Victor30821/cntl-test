import React, { useState, useRef } from "react";
import { TextDefault } from "../../text/style";
import { Text, ArrowToggle, Col, Modal, Select, ButtonWithIcon } from "components";
import { useSelector, useDispatch } from "react-redux";
import { DivMenuColumn } from "../../menu/style.js";
import { localizedStrings } from "constants/localizedStrings";
import Tooltip from "../../tooltip";
import { logout,login } from "store/modules";
import { useHistory } from "react-router-dom";
import {
  DivMenuRow,
  ProfileCircle
} from "./style.js";
import { SETTINGS_PATH, USERS_EDIT_PATH } from "constants/paths";
import { defaultUser, manager, ADMIN_URL } from "constants/environment";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import storage from 'redux-persist/lib/storage';

const convertNameToInitial = ({ name = "" }) => {
  const [firstName = '', secondName = ''] = name.split(' ');
  return `${firstName.substring(0, 1).toLocaleUpperCase()}${secondName.substring(0, 1).toLocaleUpperCase()}`;
};

const adjustElementsScreen = () => {
  const width = window.outerWidth;
  const sizeScreen = (width < 1480 && 'md') || (width >= 1480 && width < 800 && 'xl') || (width >= 1800 && 'xll') || 'md';
  const cssAdjusting = {
      'md': {
          width: '590px'
      },
      'xl': {
          width: '590px'
      },
      'xll': {
        width: '690px'
      }
  };
  return cssAdjusting[sizeScreen];
};

export default function Profile ({
  name = "",
  title = "",
  icon = "arrow-down",
  ...option
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedOrganization,setSelectedOrganization] = useState(null);
  const [stateButton,setStateButton] = useState(false);
  const [stateError,setStateError] = useState(false);
  const [stateLoading,setStateLoading] = useState(false);

  const [open, setOpen] = useState(false)
  const dispatch = useDispatch();
  let tooltipRef = useRef(null);
  let divTooltipRef = useRef(null);
  const history = useHistory();

  const {
    user
  } = useSelector(state => state.auth);

  const {
    organization,
    loadSuccess,
  } = useSelector((state) => state.organization);

  const organizations = JSON.parse(window.localStorage.getItem("@associated_organization")) || {organizations:[]};

  const { menuIsOpen } = useSelector(state => state.menu);

  const firstLetterFromName = convertNameToInitial({ name });

  const toggleTooltip = (target) => setTooltipVisible(target);


  const parseUserToEdit = user => {
    return {
      email: user.email,
      id: user.id,
      name: user.name,
      organization_id: user?.organization_id,
      phone: user.phone,
      role_id: user.role_id,
      status: user.status,
      user_setting: {
        country: user.user_settings.country,
        currency: user.user_settings.currency,
        decimal_separators: user.user_settings.decimal_separators,
        distance_unit: user.user_settings.distance_unit,
        language: user.user_settings.language,
        short_date_format: user.user_settings.short_date_format,
        short_time_format: user.user_settings.short_time_format,
        thousands_separators: user.user_settings.thousands_separators,
        timezone: user.user_settings.timezone,
        volumetric_measurement_unit: user.user_settings.volumetric_measurement_unit,
      },
      vehicles: user?.vehicles,
      groups: user?.groups,
      ignore: [
        manager !== +user.role_id && 'groups',
        manager !== +user.role_id && 'hierarchy',
        "language",
        "country",
        defaultUser === +user.role_id && 'vehicles',
        defaultUser === +user.role_id && 'clients',
      ].filter(item => item),
    }
  }

  const items = [
		{
			title: localizedStrings.yourAccount,
			icon: "profile",
			action: () =>
				history.push(USERS_EDIT_PATH, { user: parseUserToEdit(user) }),
		},
		user.role_id !== defaultUser && {
			title: localizedStrings.yourCompany,
			icon: "config",
			action: () => history.push(SETTINGS_PATH),
		},
		user.role_id === manager &&
			organizations.organizations.length > 1 && {
				title: localizedStrings.changeOrganization,
				icon: "sync",
				action: () => setOpen(true),
			},
		user.is_admin && {
			title: localizedStrings.Admin,
			icon: faCrown,
			useFontAwesome: true,
			action: async () => {
				const token = JSON.parse(await storage.getItem("@token"))?.token;
				return window.open(`${ADMIN_URL}/auth?token=${token}`, "_blank");
			},
		},
		{
			title: localizedStrings.leave,
			icon: "leave",
			action: () => {
				dispatch(logout());
			},
			style: { width: "20px", left: "6px" },
		},
	].filter((item) => item);

  React.useEffect(() => {
    if(!open) {
      setStateButton(true);
      setSelectedOrganization(null);
    };
  },[open]);

  React.useState(() => {
    setStateButton(loadSuccess);
    setStateLoading(loadSuccess);
  },[loadSuccess])

  const changeOrganization = async () => {
    const credential = await JSON.parse(window.localStorage.getItem("@credential")) || null;
    if(selectedOrganization?.value && credential) {
      setStateButton(false);
      dispatch(logout());
      dispatch(login({organization_id:selectedOrganization.value,...credential}));
    }
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        width={adjustElementsScreen()?.width}
        top={'40%'}
        header={
          <Col st={{ display: 'flex', flexDirection: 'column' }}>
            <Col>
              <Text style={{
                color: '#666666',
                fontWeight: 500,
                fontSize: '15px',
                lineHeight: '22px'
              }}>
                {localizedStrings?.labelOfModalChangeOrganization}
              </Text>
            </Col>
            <Col style={{ display: 'flex' }}>
              <Select
                title={false}
                style={{
                  minWidth: "342px",
                  marginRight: "15px"
                }}
                value={selectedOrganization}
                options={organizations?.organizations.map(vehicle => {
                  return {
                    label: vehicle.company_name,
                    value: vehicle.id
                  }
                }) || []}
                error={stateError}
                errorText={localizedStrings?.accessNotAllowed}
                loading={!stateLoading}
                placeholder={localizedStrings?.searchByNameOrCnpj}
                onChange={(org) => {
                  setSelectedOrganization(org);
                  if(org.value === user.organization_id) {
                      setStateButton(false);
                    return setStateError(true);
                  }
                  setStateButton(true);
                  setStateError(false);
                }}
                emptyStateText={localizedStrings?.searchByNameOrCnpj}
              />
              <ButtonWithIcon
                disabled={!stateButton}
                title={localizedStrings?.accessPanel}
                onClick={() => changeOrganization()}
                minWidth="109px"
                textOptions={{
                  marginLeft: '0px',
                  whiteSpace: "none",
                }}
              />
            </Col>
          </Col>}
      />
      <DivMenuRow
        background="transparent"
        justifyContent={menuIsOpen ? "flex-start" : "center"}
        paddingBottom={"18px"}
        style={{ cursor: 'pointer' }}
        ref={(ref) => (divTooltipRef = ref)}
        onClick={(e) => {
          if (!menuIsOpen) {
            toggleTooltip(!tooltipVisible && divTooltipRef);
            return;
          }
          toggleTooltip(!tooltipVisible && tooltipRef);
        }}
      >
        <Tooltip
          items={items}
          toggle={toggleTooltip}
          visible={tooltipVisible}
          id="config-popup"
        />
        <ProfileCircle
          style={{
            marginRight: menuIsOpen ? "10px" : "0px",
            marginLeft: menuIsOpen ? "14px" : "0px",
            width: menuIsOpen ? "38px" : "35px",
            height: menuIsOpen ? "37px" : "35px"
          }}
        >
          <Text fontSize={menuIsOpen ? '18px' : '14px'} color={"#1A237A"} fontWeight={"bold"}>{firstLetterFromName}</Text>
        </ProfileCircle>
        {menuIsOpen && (
          <DivMenuColumn style={{ alignItems: "flex-start", height: "auto", background: "transparent" }}>
            <Text
            white-space="nowrap"
            overflow="hidden"
            text-overflow="ellipsis"
            fontWeight={"bold"}
            color={"#fff"}
            maxWidth={'100px'}
            title={title}
            >
              {title}
            </Text>
            <TextDefault
              white-space="nowrap"
              overflow="hidden"
              text-overflow="ellipsis"
              color={"#fff"}
              lineHeight={"19px"}
              fontSize={"13px"}
              margin={"0px"}
              maxWidth={'100px'}
              title={organization?.trading_name || localizedStrings.welcomeMenu}
              >
              {organization?.trading_name || localizedStrings.welcomeMenu}
          </TextDefault>
          </DivMenuColumn>
        )}
        {menuIsOpen ? (
          <Col style={{ margin: '0px', paddingRight: '27px' }}>
            <ArrowToggle
              aria-controls="config-popup"
              aria-haspopup="true"
              ref={(ref) => (tooltipRef = ref)}
              style={{ margin: "0px" }}
            />
          </Col>
        ) : null}
      </DivMenuRow>
    </>
  );
}
