const code =
`// init ajax functions
const LIMIT_LENGTH_ARRAY = 100;
const QUANTITY_PARTS_OF_ARRAY = 10;

const callAjaxWorker = (url, data, asyncFunc = false) => {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open('POST', url, asyncFunc);
        xhttp.send(JSON.stringify({ data: data }));
        if (xhttp.status >= 200 && xhttp.status < 400) resolve(xhttp.responseText);
        reject([{}]);
    }).catch(e => [{}])
}

onmessage = (e) => onMessage(e?.data);

// end ajax functions

const onMessage = async (data) => {
    const URL = data.listAddress.map(p => {
        return {url:"/api/geocode/json?latlng=" + p.lat + "," + p.lng + "&key=" + data.maps_key + "&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1"};
    });
    const address = await getAddress({ data: URL, filters: data });
    sendData(address);
}

const sendData = (address) => {
    return postMessage(address);
}

const chunkArray = (arr = [],divider) =>{
    const chunkLength = Math.max(arr.length/divider ,1);
    const chunks = [];
    for (let i = 0; i < divider; i++) {
        if(chunkLength*(i+1) <= arr.length){
            chunks.push(arr.slice(chunkLength*i, chunkLength*(i+1)));
        };
    }
    return chunks;
}

const getAddress = async ({ data, filters }) => {
    try {
        const URL = filters.urls.API_URL_PROXY + 'api/multi_requests/';

        if(data.length > LIMIT_LENGTH_ARRAY) {
            const response_data = []
            const arrayDivider = chunkArray(data, QUANTITY_PARTS_OF_ARRAY);
            for(let i = 0; i < arrayDivider.length; i++) {
                const response = await callAjaxWorker(URL, arrayDivider[i], false);
                const { content } =JSON.parse(response) || {content: []};
                content.forEach(elem => response_data.push(elem));
            }
            return response_data;
        }
        const response = await callAjaxWorker(URL, data);
        const { content } = JSON.parse(response) || {content: []};
        return content;
    } catch (error) {
        console.log(error);
    }
}
`;

const blob = new Blob([code], {type: "application/javascript"});

const worker_script = URL.createObjectURL(blob);

export default worker_script;
