import React from "react";
import { MainMenu } from "containers";
import { HeaderIconBar, ErrorBoundary } from "components";
import { useSelector } from "react-redux";
import { ContainerWrapper, ScrollableContainer } from "./style";

export default function MenuWithLogoBar({ children, history }) {
  const onMap = history.location.pathname === '/mapa';
  const onEditOrCreate = ['criar','editar'].some(path => history.location.pathname.includes(path))
  console.log(history.location.pathname)
  const { name } = useSelector(state => state.auth.user);
  console.log(history)
  console.log(onEditOrCreate)
  if(onEditOrCreate){
    return (
      <>
        <ContainerWrapper>
          <ScrollableContainer>
            <HeaderIconBar history={history}/>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ScrollableContainer>
        </ContainerWrapper>
      </>
    );
  }
 
    return (
      <>
        <ContainerWrapper>
          <MainMenu title={name} history={history} />
          <ScrollableContainer>
           <HeaderIconBar history={history}/>
           {!onMap && (<HeaderIconBar history={history}/>)}
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          </ScrollableContainer>
        </ContainerWrapper>
      </>
    );

}
