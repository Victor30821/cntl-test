export default (value, options = []) =>
  options.filter(item => item.value === value).length > 0
    ? options.filter(item => item.value === value)[0]
    : null;
