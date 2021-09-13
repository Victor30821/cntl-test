const getUrlParam = (sParam) => {
    let param = false;
    try {
        param = new URL(window.location.href).searchParams.get(sParam);
    } catch (error) {
        console.error("Error when parsing params");
    }
    return param
};

const setUrlParam = (key, value) => {
    if (!window.history.pushState || !key) return;
    let url = new URL(window.location.href);
    const params = new window.URLSearchParams(window.location.search);

    if (value === undefined || value === null || (Array.isArray(value) && !value.length)) {
        params.delete(key);
    } else {
        params.set(key, value);
    }

    url.search = params;
    url = url.toString();
    window.history.replaceState({
        ...window.history.state,
        url: url
    }, null, url)
}

export { getUrlParam, setUrlParam }