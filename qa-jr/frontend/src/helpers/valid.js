export function validEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

export function validPhone(phone) {
  if (/^\+?\d+$/.test(phone)) {
    return true;
  }
  return false;
}
