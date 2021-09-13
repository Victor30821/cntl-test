import { API_URL, API_URL_MAP, API_URL_PROXY, HTTP_STATUS ,URL_SMS, API_URL_TRACKINGS} from '../constants/environment';
import { store } from '../store';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import AsyncLock from 'async-lock';
import storage from 'redux-persist/lib/storage';
import { fetchLogoutSuccess } from 'store/modules';
import qs from "qs";
import { LOGIN_PATH } from 'constants/paths';
const lock = new AsyncLock();

const proxyApi = axios.create({
    baseURL: API_URL_PROXY,
});

const mapApi = axios.create({
    baseURL: API_URL_MAP,
});

const api = axios.create({
    baseURL: API_URL,
});

const smsAPI = axios.create({
    baseURL: URL_SMS,
});

const apiRoutes = axios.create({
    baseURL: API_URL_TRACKINGS,
})


axiosRetry(api, { retries: 2 });

const refreshToken = async ({ token }) => {
    await lock.acquire('refreshToken', async (done) => {
        try {
            const {
                data: { token: newToken }
            } = await api.post("/authenticator/v1/refresh", qs.stringify({ token: token }));
            await storage.setItem("@token", JSON.stringify({ token: newToken }))
            done();
        } catch (error) {
            store.dispatch(fetchLogoutSuccess());

            if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) window.open(window.location.origin + LOGIN_PATH, "_self");

            done();
        }
    });
}

const configureApisWithToken = axiosInstance => {
    axiosInstance.interceptors.request.use(
        async config => {
            try {
                const isProxyUrl = config.baseURL.match("contele.com.br/");
                const urlIsNotFromContele = config.url.match("https://");

                const ignoreToken = urlIsNotFromContele || isProxyUrl;

                if (ignoreToken) return config;

                const token = JSON.parse(await storage.getItem("@token"))?.token;

                if (token) config.headers.Authorization = 'Bearer ' + token;
            } catch (error) {
                console.log("configure", error);
                store.dispatch(fetchLogoutSuccess());
            }
            return config;
        },
        err => Promise.reject(err)
    );
}
api.interceptors.response.use(
    response => response,
    async error => {
        try {
            const status = error?.response?.status;
            if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
                const token = JSON.parse(await storage.getItem("@token"))?.token;
                refreshToken({ token })
            }
        } catch (error) {
            console.log("error", error);
            store.dispatch(fetchLogoutSuccess());
        }
        return Promise.reject(error);
    }
);

[
    mapApi,
    api,
    proxyApi,
    apiRoutes
].map(configureApisWithToken);

export {
    mapApi,
    api,
    proxyApi,
    smsAPI,
    apiRoutes
};
