export default function RegistrationData(db) {
  async function captureReg(regNum, townId) {
    try {
      let regCount = await db.oneOrNone(
        "select count(*) from registrations where regNumber = $1",
        [regNum]
      );
      if (regNum && Number(regCount.count) > 0) {
        return;
      } else if (regNum && Number(regCount.count) === 0) {
        await db.none(
          "insert into registrations (regnumber,town_id) values($1,$2)",
          [regNum, townId]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function setTownId(regStart) {
    try {
      if (regStart) {
        let townId = await db.oneOrNone(
          "select id from towns where regstart =$1",
          [regStart]
        );
        return townId.id;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function allRegistrations(town) {
    try {
      let results = await filterReg(town);
      return results.reverse();
    } catch (err) {
      console.log(err);
    }
  }

  async function showThisReg(regNum) {
    try {
      let result = await db.oneOrNone(
        "select regnumber from registrations where regnumber = $1",
        [regNum]
      );
      return result.regnumber;
    } catch (err) {
      console.log(err);
    }
  }

  async function getTownId(town) {
    let townId = await db.oneOrNone("select id from towns where townname =$1", [
      town,
    ]);
    return townId.id;
  }
  async function filterReg(town) {
    try {
      let results;
      let townId = await getTownId(town);

      if (townId === 5) {
        results = await db.manyOrNone("select regnumber from registrations");
      } else {
        results = await db.manyOrNone(
          "select regnumber from registrations where town_id=$1",
          [townId]
        );
      }

      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async function clearAll() {
    try {
      await db.none("delete from registrations");
    } catch (err) {
      console.log(err);
    }
  }
  async function checkAvailable(regInput) {
    let regCount = await db.oneOrNone(
      "select count(*) from registrations where regNumber = $1",
      [regInput]
    );
    return Number(regCount.count);
  }
  async function checkIfRows() {
    let results = await db.one("select count(*) from registrations");

    return Number(results.count);
  }
  return {
    captureReg,
    allRegistrations,
    clearAll,
    showThisReg,
    filterReg,
    checkAvailable,
    checkIfRows,
    setTownId,
    getTownId,
  };
}
