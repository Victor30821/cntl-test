import React, { useMemo } from "react";
import { ArrowToggle, Icon, Text, Col } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { selectChildScreen, selectScreen } from "../../../store/modules";
import { ItemDepthOne } from "./itemDepthOne";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from '@material-ui/styles/withStyles';
import {
  ClickableMenuItem,
  DivArrowToggle,
  DivCircle,
  Circle,
  ListSubitem
} from "./style.js";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#1D1B84',
    maxWidth: 220,
    fontSize: 12,
    border: '1px solid #dadde9',
    padding: '1px',
    marginTop: '10%'
  },
}))(Tooltip);

function ItemMenu({
  id,
  path,
  iconMarginRight,
  iconPaddingLeft,
  screens,
  hasToggle,
  hasIconTooltip = false,
  history,
  name,
  ...options
}) {
  const dispatch = useDispatch();

  const { menuIsOpen, currentScreen } = useSelector(state => state.menu);

  const onItemClick = screenId => {
    dispatch(selectScreen(screenId));
  };

  const setSelectedChildrenScreen = screensObj =>
    dispatch(selectChildScreen(screensObj));

  const isScreenSelectedAndMenuOpen = useMemo(
    () => menuIsOpen && currentScreen === id && !hasToggle,
    [menuIsOpen, currentScreen, id, hasToggle]
  );

  const isScreenSelectedAndMenuClosed = useMemo(
    () => !menuIsOpen && currentScreen === id,
    [menuIsOpen, currentScreen, id]
  );

  return (
    <ClickableMenuItem
      key={id}
      flexDirection={"column"}
      paddingTop={"0px"}
      paddingBottom={"0px"}
      position={"relative"}
      disableHover={screens &&
        screens.length > 0 &&
        currentScreen === id &&
        hasToggle ? "transparent" : "#1D1B84"}
    > <HtmlTooltip
      title={
        !menuIsOpen ? (
          <Col style={{ padding: '0px', cursor: 'pointer' }}>
            {(screens &&
              screens.length > 0 &&
              currentScreen === id && screens.map(
                (screen, index) =>
                  (
                    <ItemDepthOne
                      index={index}
                      key={index}
                      {...screen}
                      currentPath={path}
                      history={history}
                      styles={{ paddingLeft: '10px !important' }}
                      subStyles={{ paddingLeft: '15px !important' }}
                      linkProps={{ fontSize: '13px' }}
                    />
                  )
              )) || <Col style={{ padding: '10px' }}>
                <Text color='#fff' fontWeight='bold'>
                  {options.title}
                </Text>
              </Col>}
          </Col>
        ) : ''}
      placement="right-end" interactive>
        <ClickableMenuItem
          paddingTop={"17px"}
          paddingBottom={"17px"}
          paddingRight={"4px"}
          backgroundColor={
            menuIsOpen && currentScreen === id && hasToggle
              ? "#403D8C"
              : "transparent"
          }
          justifyContent={menuIsOpen ? "flex-start" : "center"}
          onClick={() => {
            const hasScreens = screens && screens.length > 0;

            if (hasScreens && currentScreen === id) {
              return onItemClick(-1);
            }
            setSelectedChildrenScreen({ depthOne: -1, depthTwo: -1 });
            onItemClick(id);
          }}
          as={screens?.length > 0 ? "div" : "a"}
          href={path}
          data-menu={name}
        >
          <Icon
            icon={options.icon}
            width="27px"
            height={menuIsOpen ? "18px" : "18px"}
            color="#ccc"
            style={{
              opacity:
                isScreenSelectedAndMenuOpen || isScreenSelectedAndMenuClosed
                  ? "1"
                  : "0.6",
              marginLeft: menuIsOpen ? "12px" : "10px",
              marginRight: iconMarginRight || "8px",
              paddingLeft: iconPaddingLeft || "0px"
            }}
            {...options}
          />
          {menuIsOpen && (
            <Text cursor={"pointer"} fontWeight={"bold"} color={"#fff"} fontSize={"13px"}>
              {options.title}
            </Text>
          )}
          {
            hasIconTooltip && 
            <Icon
            icon={options.iconToolTip || "warning2"}
            tooltipText={options.iconToolTipText || ""}
            width="27px"
            height={menuIsOpen ? "12px" : "8px"}
            color={options.iconToolTipColor || "#ccc"}
            style={{
              opacity: "1",
              marginRight: iconMarginRight || "2px",
              marginLeft: isScreenSelectedAndMenuOpen || isScreenSelectedAndMenuClosed ? "-16px" : "0px",
              paddingLeft: iconPaddingLeft || "2px"
            }}
          />
          }
          {hasToggle && menuIsOpen && (
            <DivArrowToggle top='10%' isActive={currentScreen === id}>
              <ArrowToggle />
            </DivArrowToggle>
          )}
          {(isScreenSelectedAndMenuOpen || isScreenSelectedAndMenuClosed) && (
            <DivCircle>
              <Circle />
            </DivCircle>
          )}
        </ClickableMenuItem>
      </HtmlTooltip>
      <ListSubitem backgroundColor="#00000010">
        {screens &&
          screens.length > 0 &&
          currentScreen === id &&
          hasToggle &&
          screens.map(
            (screen, index) =>
              menuIsOpen && (
                <ItemDepthOne
                  index={index}
                  key={index}
                  {...screen}
                  currentPath={path}
                  history={history}
                />
              )
          )}
      </ListSubitem>
    </ClickableMenuItem>
  );
}
export default ItemMenu;
