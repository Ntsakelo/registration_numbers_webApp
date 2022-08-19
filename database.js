export default function RegistrationData(db) {
  let townId = 0;
  async function captureReg(regNum, townId) {
    try {
      let regCount = await db.oneOrNone(
        "select count(*) from registration where regNumber = $1",
        [regNum]
      );
      if (regNum && Number(regCount.count) > 0) {
        return;
      } else if (regNum && Number(regCount.count) === 0) {
        await db.none(
          "insert into registration (regnumber,town_id) values($1,$2)",
          [regNum, townId]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function allRegistrations() {
    let results;
    let regList;
    try {
      if (townId === 0) {
        results = await db.manyOrNone("select regnumber from registration");
        regList = results;
      } else {
        results = await db.manyOrNone(
          "select regnumber from registration where town_id = $1",
          [townId]
        );
        regList = results;
      }

      return regList.reverse();
    } catch (err) {
      console.log(err);
    }
  }

  async function showThisReg(regNum) {
    try {
      let result = await db.oneOrNone(
        "select regnumber from registration where regnumber = $1",
        [regNum]
      );
      return result.regnumber;
    } catch (err) {
      console.log(err);
    }
  }

  async function filterReg(town) {
    let result;
    try {
      if (town === "all") {
        townId = 0;
        result = await db.manyOrNone("select regnumber from registration");
      } else if (town === "bellville") {
        townId = 1;
        result = await db.manyOrNone(
          "select regnumber from registration where town_id = $1",
          [townId]
        );
      } else if (town === "capeTown") {
        townId = 2;
        result = await db.manyOrNone(
          "select regnumber from registration where town_id = $1",
          [townId]
        );
      } else if (town === "kuilsRiver") {
        townId = 3;
        result = await db.manyOrNone(
          "select regnumber from registration where town_id = $1",
          [townId]
        );
      } else if (town === "paarl") {
        townId = 4;
        result = await db.manyOrNone(
          "select regnumber from registration where town_id = $1",
          [townId]
        );
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async function clearAll() {
    try {
      await db.none("delete from registration");
    } catch (err) {
      console.log(err);
    }
  }
  async function checkAvailable(regInput) {
    let regCount = await db.oneOrNone(
      "select count(*) from registration where regNumber = $1",
      [regInput]
    );
    return Number(regCount.count);
  }

  return {
    captureReg,
    allRegistrations,
    clearAll,
    showThisReg,
    filterReg,
    checkAvailable,
  };
}
