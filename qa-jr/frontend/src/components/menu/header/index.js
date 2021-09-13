import React, { useMemo, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { selectScreen, loadOrganizationAchievements } from "store/modules";
import { DivMenuColumn, DivMenuRow } from "../style.js";
import {
  DivCircle,
  Circle,
} from "../item/style.js";
import { ImageMenuHeader, UsageAchievementMenuItem } from "./style.js";
import Profile from "../profile";
import { Text, PercentageProgressBar } from "components";
import { USAGE_ACHIEVEMENTS_PATH } from "constants/paths.js";
export default function HeaderMenu({
  id,
  name= '',
  title = '',
  icon = "arrow-down",
  ...option
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { menuIsOpen, currentScreen } = useSelector(state => state.menu);

  const onItemClick = screenId => {
    dispatch(selectScreen(screenId));
  };

  const isScreenSelectedAndMenuOpen = useMemo(
    () => menuIsOpen && currentScreen === id ,
    [menuIsOpen, currentScreen, id]
  );

  const isScreenSelectedAndMenuClosed = useMemo(
    () => !menuIsOpen && currentScreen === id,
    [menuIsOpen, currentScreen, id]
  );
  const {
    organization: { achievement_score = 0 }
  } = useSelector((state) => state.organization);

  const {
    user: {
      organization_id
    },
  } = useSelector((state) => state.auth);

  const handleUsageAchievement = () => {
    onItemClick(id);
    history.push(`${USAGE_ACHIEVEMENTS_PATH}`);
  }

  useEffect(() => {
    if(!achievement_score) dispatch(loadOrganizationAchievements(organization_id));
  }, []);

  return (
    <DivMenuColumn
      position={"relative"}
      height={"min-content"}
      padding="0px"
      width="100%"
    >
      <DivMenuRow
        background={"transparent"}
        position={"relative"}
        justifyContent="center"
        menuIsOpen={menuIsOpen}
      >
        <ImageMenuHeader
          style={
            !menuIsOpen
              ? {
                  padding: "2px",
                  maxWidth: "50px",
                }
              : {}
          }
          alt={""}
          src={
            menuIsOpen
              ? "https://images.contelege.com.br/contele-rastreador-horiz-transparente.png"
              : "https://images.contelege.com.br/icone-contele-rastreador-transparente.png"
          }
        />
      </DivMenuRow>
      <Profile title={title} name={name} />
      <UsageAchievementMenuItem menuIsOpen={menuIsOpen} > 
        <PercentageProgressBar 
          barHeight={'10px'}
          backgroundBarColor={'#141470'}
          barColor={'#B3B1FF'}
          borderRadius={'50px'}
          text={menuIsOpen &&
            <div style={{ display: 'flex', marginTop: '7px'}}>
              <Text style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#E9E9FF',
              }}>
              {`${achievement_score?.toFixed?.(0) || 0}%`}
              </Text>
              &nbsp;
              <Text style={{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#E9E9FF',
              }}>
                {"de aproveitamento"}
              </Text>
            </div>
          }
          value={achievement_score}
          onClick={handleUsageAchievement}
        />
        {(isScreenSelectedAndMenuOpen || isScreenSelectedAndMenuClosed) &&
          <DivCircle>
            <Circle />
          </DivCircle>
        }
      </UsageAchievementMenuItem>
    </DivMenuColumn>
  );
}
