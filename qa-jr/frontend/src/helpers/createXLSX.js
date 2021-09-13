import XLSX from 'xlsx';

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

const download = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
}


function bufferInterator(workBookOut) {
    const buffer = new ArrayBuffer(workBookOut.length);
    const view = new Uint8Array(buffer);
    for (let i=0; i !== workBookOut.length; ++i)
        view[i] = workBookOut.charCodeAt(i) & 0xFF

    return buffer
}

export default  ({document = [], fileName = 'doc.xlsx', tabName = "Tab1", multipleTabs = false, sendEmail = false}) => {

    const workBook = new Workbook();

    const is_array_tab_name = Array.isArray(tabName) && tabName?.length > 0;

    if(multipleTabs && is_array_tab_name) {
        
            document.forEach((data, i) => {

                const tab_name = tabName[i];

                workBook.SheetNames.push(tab_name);

                const is_multiple_data = 
                    Array.isArray(data) &&
                    data.length > 0;

                workBook.Sheets[tab_name] = XLSX.utils.json_to_sheet(is_multiple_data ? data : [data]);

            });
    
            const workBookOut = XLSX.write(workBook, { bookType: 'xlsx', bookSST: true, type: 'binary',  });
    
            const url = window.URL.createObjectURL(new Blob([bufferInterator(workBookOut)], { type: 'application/octet-stream' }));
        
            download(url, `${fileName}.xlsx`);
    
            return;   

    }
    const createDataSheet = XLSX.utils.json_to_sheet(document);

    workBook.SheetNames.push(tabName);

    workBook.Sheets[tabName] = createDataSheet;

    const workBookOut = XLSX.write(workBook, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    if(sendEmail) {
        const bs64_file = btoa(workBookOut);
        return bs64_file;
    }

    const url = window.URL.createObjectURL(new Blob([bufferInterator(workBookOut)], { type: 'application/octet-stream' }));

    download(url, `${fileName}.xlsx`);
}
