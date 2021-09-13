import { css } from "styled-components";

const resetStyle = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100 %;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  * [hidden] {
    display: none;
  }
  body {
    line-height: 1;
    font-family: "Roboto", sans-serif;
    background: #f8f8fb;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote: before, blockquote: after,
  q: before, q: after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  /* http://www.paulirish.com/2012/box-sizing-border-box-ftw/ (2015/04/28)*/
  html {
    box-sizing: border-box;
  }
  html,
  body {
    height: 100%;
  }
  body.swal2-height-auto {
    height: 100% !important;
  }
  #root {
    height: inherit;
  }

  *, *: before, *: after {
    box-sizing: inherit;
  }
  /* Additional resets */
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    outline: none;
    line-height: inherit;
    -webkit-appearance: none;
  }
  /* Fix antialiasing */
  *, *: before, *: after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* Disable user select on everything but texts */
  *, *: before, *: after {
    user-select: none;
  }
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockquote,
  pre,
  ul,
  ol,
  li,
  table,
  tr,
  th,
  td,
  input,
  textarea {
    user-select: text;
  }
  /* SCROLLBAR */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ababab60;
  }

  /* TABLE COMPONENT */
  .ReactVirtualized__Grid__innerScrollContainer {
    width: 100% !important;
  }
  .ReactVirtualized__Table__Grid {
    outline: none;
    width: 100% !important;
  }
  .ReactVirtualized__Table {
    width: 100% !important;
  }

  .ReactVirtualized__Table__headerColumn {
    outline: none;
    margin: 0;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .column-header-wrapper {
    padding-left: 0px !important;
    padding-right: 16px !important;
  }

  .ReactVirtualized__Table__rowColumn {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .ReactVirtualized__Table__headerRow {
    width: 100% !important;
    text-transform: inherit;
    height: auto !important;
  }

  .ReactVirtualized__Table__row {
    width: 100% !important;
  }

  #logiticsServicesManage .ReactVirtualized__Table__row,
  #solicitationManage .ReactVirtualized__Table__row,
  #vehicleManage .ReactVirtualized__Table__row,
  #groupManage .ReactVirtualized__Table__row,
  #fenceManage .ReactVirtualized__Table__row,
  #driverManage .ReactVirtualized__Table__row,
  #clientManage .ReactVirtualized__Table__row,
  #clientManage .ReactVirtualized__Table__row,
  #placeManage .ReactVirtualized__Table__row {
    cursor: pointer;
  }

  .ReactVirtualized__Table__row:nth-child(even) {
    background: #FFFFFF;
  }

  .ReactVirtualized__Table__row:nth-child(odd) {
    background: #F5F6FF;
  }

  .ReactVirtualized__Table__row:hover {
    background: #F0F1FF;
  }

  .ReactVirtualized__Table__row:hover svg.icon-delete {
    color: #C1C1DD;
  }

  .ReactVirtualized__Table__row:focus {
    outline: none;
  }

  svg.icon-delete:hover {
    color: #FD3995;
  }

  .ReactVirtualized__Table__rowColumn {
    display: flex;
    align-items: center;
    height: 100%;
  }

  /* PLACEHOLDER ANIMATION */
  @keyframes placeHolderShimmer {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 100em 0;
    }
  }

  /* PAGINATION COMPONENT */
  .MuiPaginationItem-page.Mui-selected {
    background-color: #2431a4 !important;
    color: white !important;
  }
  .MuiPaginationItem-root {
    color: #1d1b84 !important;
  }
  .MuiPaginationItem-icon + .MuiTouchRipple-root {
    background: #1d1b8440;
  }
  svg {
    overflow: inherit;
  }

  /* SPIN ANIMATION */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(720deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(720deg); }
  }
  /* GOOGLE MAPS ICON */
  .gm-style-iw.gm-style-iw-c{
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin-top: 30px;
  }
  .gm-ui-hover-effect, .gm-style .gm-style-iw-t::after {
    display: none !important;
  }
  .gm-style-iw-d{
    max-height: none !important;
    min-height: auto !important;
    display: flex !important;
    align-items: flex-end !important;
    overflow: visible !important;
    padding: 0px 0 5px !important;
  }
  .gm-style-iw-t {
    bottom: 0px !important;;
  }

  /* TOAST */
  .Toastify__toast {
    border-radius: 5px;
    padding: 16px;
  }

  .modal-trackers-container {
    min-width: 75%;
  }
  @keyframes module_img {
    to { transform: rotate(1turn); }
  }
  @keyframes module {
    to { transform: rotate(-1turn); }
  }

  /* CHANGELOGFY */
  #changelogfy_badge {
    right: -12px;
    bottom: 40px;
    left: auto !important;
  }
  /* MENU DROPDOWN */
  .MuiList-root {
    min-width: 120px;
  }

  body.swal2-height-auto {
    height: 100% !important;
  }
  @keyframes animatedLive {
    0% {
      content: "";
      transform: scale(1.1);
      opacity: 0.5;
    }
    50% {
      content: "";
      transform: scale(1.5);
      opacity: 0.7;
    }
    100% {
      content: "";
      opacity: 1;
      transform: scale(2);
    }
  }

  .animated-live::before{
    content: "";
    position: absolute;
    background-color: #25968A;
    width: 6px;
    height: 6px;
    left: 12px;
    top: calc(50% - 6px/2);
    border-radius: 35px;
    animation: animatedLive 600ms linear infinite alternate;
    transition: all 1s ease-out;
  }
  .animated-live > :first-child > *{
    padding-left: 15px !important;
  }

  .flex {
	  display: flex;
  }

  .column {
	  flex-direction: column
  }

  .row {
	  flex-direction: row
  }

  .justifyCenter {
	  justify-content: center
  }

  .justifyBetween {
	  justify-content: space-between
  }

  .justifyAround {
    justify-content: space-around
  }
  
  .justifyStart {
    justify-content: flex-start
  }
  
  .justifyEnd {
    justify-content: flex-end
  }
  
  .justifyEvenly {
    justify-content: space-evenly
  }
  
  // Cursor not-allowed for disable itens
  
  .cursorNotAllowed,
  
    cursor: not-allowed;
  
  }
  
  .flexWrap {
	  flex-wrap: wrap
  }

  .fullContainerWidth {
	  width: 100%
  }

  .fullContainerHeight {
	  height: 100%
  }

  .alignCenter {
	  align-items: center;
  }

  .alignEnd {
	  align-items: flex-end;
  }

  .alignStart {
	  align-items: flex-start;
  }

  /* COLUMN SIZES */
.flex1{
  flex: 1 !important;
}
.flex09{
  flex: 0.9 !important;
}
.flex08{
  flex: 0.8 !important;
}
.flex07{
  flex: 0.7 !important;
}
.flex06{
  flex: 0.6 !important;
}
.flex05{
  flex: 0.5 !important;
}
.flex04{
  flex: 0.4 !important;
}
.flex03{
  flex: 0.3 !important;
}
.flex02{
  flex: 0.2 !important;
}
.flex01{
  flex: 0.1 !important;
}
.flex0{
  flex: 0 !important;
}

// Cursor not-allowed for disable itens
.cursorNotAllowed,
.cursorNotAllowed * {
	cursor: not-allowed;
}

`;

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px"
};

const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`
};

export { resetStyle, device };
