export async function validateData(promise, name = "drivers") {
  try {
    let result = await promise;

    const hasData =
      result &&
      result.hasOwnProperty("data") &&
      result.data.hasOwnProperty(name);

    if (!hasData) return Promise.reject(name + " not exists");

    return {
      data: result.data
    };
  } catch (error) {
    return error;
  }
}
