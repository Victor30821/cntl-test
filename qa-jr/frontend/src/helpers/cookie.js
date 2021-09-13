import Cookies from "universal-cookie";
const TOKEN = "@token";
export const Cookie = new Cookies();
export const cookieGet = () => Cookie.get(TOKEN);
export const cookieSet = data => Cookie.set(TOKEN, data, { path: "/" });
export const cookieRemove = () => Cookie.remove(TOKEN, { path: "/" });
export const cookieListener = cb =>
  Cookie.addChangeListener(({ value }) => cb(!!value));
