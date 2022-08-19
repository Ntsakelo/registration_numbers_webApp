export default function regRoutes(regNumbers, registrationData) {
  async function showReg(req, res, next) {
    try {
      let registrations = await registrationData.allRegistrations();
      res.render("index", {
        registrations,
        errorType: regNumbers.validateMessage().includes("Sucessfully")
          ? "sucess"
          : "danger",
      });
    } catch (err) {
      next(err);
    }
  }

  async function regNumberRoute(req, res, next) {
    try {
      let regInput = req.body.registration.toUpperCase();
      let town = req.body.towns;
      regNumbers.getRegNumber(regInput);

      if (regNumbers.isValid() === "invalid") {
        regInput = "";
      }
      function getTownId() {
        let townId = 0;
        if (regInput.startsWith("CY")) {
          townId = 1;
        } else if (regInput.startsWith("CA")) {
          townId = 2;
        } else if (regInput.startsWith("CF")) {
          townId = 3;
        } else if (regInput.startsWith("CJ")) {
          townId = 4;
        }
        return townId;
      }
      let regCount = await registrationData.checkAvailable(regInput);
      if (regCount > 0) {
        regNumbers.validState("");
      }
      await registrationData.captureReg(regInput, getTownId);
      await registrationData.filterReg(town);
      req.flash("info", regNumbers.validateMessage());
      res.redirect("/reg_numbers");
    } catch (err) {
      next(err);
    }
  }

  async function currentRegRoute(req, res, next) {
    try {
      let regNum = req.params.regNum;
      let result = await registrationData.showThisReg(regNum);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  async function clearRoute(req, res, next) {
    try {
      let count = await registrationData.checkIfRows();
      if (count > 0) {
        regNumbers.validState("cleared");
        await registrationData.clearAll();
      } else if (count <= 0) {
        regNumbers.validState("empty");
      }
      req.flash("info", regNumbers.validateMessage());
      res.redirect("/reg_numbers");
    } catch (err) {
      next(err);
    }
  }

  async function filterRoute(req, res, next) {
    try {
      let town = req.body.towns;

      await registrationData.filterReg(town);
      res.redirect("/reg_numbers");
    } catch (err) {
      next(err);
    }
  }

  //return
  return {
    showReg,
    regNumberRoute,
    clearRoute,
    currentRegRoute,
    filterRoute,
  };
}
