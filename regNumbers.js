export default function () {
  let regNum = "";
  let valid = "";
  let town = "";

  function getRegNumber(val) {
    if (val === "") {
      valid = "nothing";
    } else if (val == Number(val)) {
      regNum = "";
      valid = "number";
    } else if (
      /^C[AFJY]\s[0-9][0-9][0-9](\S|-|\s|)[0-9][0-9][0-9]$/.test(val)
    ) {
      regNum = val;
      valid = "valid";
    } else {
      regNum = "";
      valid = "invalid";
    }
  }

  function isValid() {
    return valid;
  }

  function fromTown() {
    if (regNum.startsWith("CA")) {
      town = "Cape town";
    } else if (regNum.startsWith("CF")) {
      town = "Kuilsriver";
    } else if (regNum.startsWith("CJ")) {
      town = "Paarl";
    } else if (regNum.startsWith("CY")) {
      town = "Bellville";
    }
    return town;
  }
  function validateMessage() {
    if (isValid() === "") {
      return `The registration ${regNum} already exists`;
    } else if (isValid() === "nothing") {
      return "Enter a registration number";
    } else if (isValid() === "number") {
      return "The registration entered is invalid";
    } else if (isValid() === "invalid") {
      return "The registration entered is invalid";
    } else if (isValid() === "valid") {
      return `Sucessfully entered a ${fromTown()} registration`;
    }
  }
  function validState(string) {
    valid = string;
  }

  return {
    getRegNumber,
    isValid,
    validateMessage,
    fromTown,
    validState,
  };
}
