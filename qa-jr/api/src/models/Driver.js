const fs = require('fs');

const fsWriteData = (fileData) => {
  fs.writeFileSync('DriverList.json', JSON.stringify(fileData), (error) => {
    if (error) {
      console.log({ Error: error });
    }
  });
}

const addZero = (number) => {
  if (number<= 9) return "0" + number;
  return number
}

module.exports = {

  find() {
    if (!fs.existsSync('./DriverList.json')) {
      return undefined;
    }
    const fileData = JSON.parse(fs.readFileSync('./DriverList.json'));
    return fileData;
  },

  new(user) {
    let fileData;
    if (fs.existsSync('./DriverList.json')) {
      fileData = JSON.parse(fs.readFileSync('./DriverList.json'));
      const userAlreadyExists = fileData.find((x) => x.email === user.email);

      if (userAlreadyExists) {
        return undefined;
      }
      fileData.push(user);
      fsWriteData(fileData);
    } else {
      fileData = [user];
      fsWriteData(fileData);
    }

    return fileData;
  },

  findById(id) {
    const fileData = JSON.parse(fs.readFileSync('./DriverList.json'));
    const idOwner = fileData.find((user) => user.id === id);
    if (!idOwner) {
      return undefined;
    }
    return idOwner;
  },

  update(payload) {
    const fileData = JSON.parse(fs.readFileSync('./DriverList.json'));

    const userIndex = fileData.findIndex((user) => user.id === payload.id);

    const emailAlreadyUsed = fileData.find((user) => user.email === payload.email && user.id !== payload.id);

    if (emailAlreadyUsed) {
      return undefined;
    }
    
    const newDateUpdate = new Date(payload['expire_driver_license'])
    const newDateUpdateParsed = (addZero(newDateUpdate.getDate().toString()) + "/" + (addZero(newDateUpdate.getMonth()+1).toString()) + "/" + newDateUpdate.getFullYear());

    payload['expire_driver_license'] = newDateUpdateParsed

    fileData[userIndex] = payload;
    fsWriteData(fileData);
    return payload;
  },

  deleteAll() {
    const fileData = JSON.parse(fs.readFileSync('./DriverList.json'));
    fileData.length = 0;

    fsWriteData(fileData);

    return fileData;
  },

  deleteOne(id) {
    const fileData = JSON.parse(fs.readFileSync('./DriverList.json'));

    const newFileData = fileData.filter((user) => user.id !== id);
    fsWriteData(newFileData);

    return newFileData;
  },

};