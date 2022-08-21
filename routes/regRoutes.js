export default function regRoutes(regNumbers, registrationData) {
  let selectedTown = "";
  async function showReg(req, res, next) {
    try {
      if (selectedTown === "") {
        selectedTown = "all";
      }
      let registrations = await registrationData.allRegistrations(selectedTown);
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

      regNumbers.getRegNumber(regInput);
      if (regInput !== "" && selectedTown !== "") {
        selectedTown = "all";
      }
      if (regNumbers.isValid() === "invalid") {
        regInput = "";
      }
      let regStart = regInput.slice(0, 2);
      let townId = await registrationData.setTownId(regStart);
      let regCount = await registrationData.checkAvailable(regInput);
      if (regCount > 0) {
        regNumbers.validState("");
      }
      await registrationData.captureReg(regInput, townId);
      req.flash("info", regNumbers.validateMessage());
      res.redirect("/reg_numbers");
    } catch (err) {
      next(err);
    }
  }

  async function currentRegRoute(req, res, next) {
    try {
      let regNum = req.params.regNum;
      let result = await registrationData.showThisReg(regNum.toUpperCase());
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
      selectedTown = town;
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
