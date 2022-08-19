import assert from "assert";
import RegistrationData from "../database.js";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/registration_numbers_tests";

const db = pgp({ connectionString });

describe("test the registration numbers database factory function", function () {
  it("should be able to store registrations into the database", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();
      await registrationData.captureReg("CA 222-222", 2);
      await registrationData.captureReg("CJ 111-211", 4);
      await registrationData.captureReg("CF 000111", 3);
      await registrationData.captureReg("CY 333 444", 1);

      await registrationData.filterReg("all");
      let results = await registrationData.allRegistrations();
      assert.deepEqual(
        [
          {
            regnumber: "CY 333 444",
          },
          {
            regnumber: "CF 000111",
          },
          {
            regnumber: "CJ 111-211",
          },
          {
            regnumber: "CA 222-222",
          },
        ],
        results
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should not be able to store duplicate registration numbers", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 111-111");
      await registrationData.captureReg("CA 111-111");
      await registrationData.filterReg("all");
      let results = await registrationData.allRegistrations();
      assert.deepEqual([{ regnumber: "CA 111-111" }], results);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to filter registrations from Bellville", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CA 000-000", 2);
      await registrationData.captureReg("CY 000-000", 1);
      await registrationData.captureReg("CY 222-300", 1);
      await registrationData.filterReg("bellville");
      let results = await registrationData.allRegistrations();
      assert.deepEqual(
        [{ regnumber: "CY 222-300" }, { regnumber: "CY 000-000" }],
        results
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to filter registrations from cape town", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CA 000-000", 2);
      await registrationData.captureReg("CY 000-000", 1);
      await registrationData.captureReg("CY 222-300", 1);
      await registrationData.filterReg("capeTown");
      let results = await registrationData.allRegistrations();
      assert.deepEqual(
        [{ regnumber: "CA 000-000" }, { regnumber: "CA 222-000" }],
        results
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to filter registrations from kuilsriver", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CF 292-414", 3);
      await registrationData.captureReg("CY 000-000", 1);
      await registrationData.captureReg("CY 222-300", 1);
      await registrationData.filterReg("kuilsRiver");
      let results = await registrationData.allRegistrations();
      assert.deepEqual([{ regnumber: "CF 292-414" }], results);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to filter registrations from paarl", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CA 000-000", 2);
      await registrationData.captureReg("CJ 400-500", 4);
      await registrationData.captureReg("CY 222-300", 1);
      await registrationData.filterReg("paarl");
      let results = await registrationData.allRegistrations();
      assert.deepEqual([{ regnumber: "CJ 400-500" }], results);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to display a specific registration number", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CA 000-000", 2);
      await registrationData.captureReg("CJ 400-500", 4);
      let results = await registrationData.showThisReg("CA 000-000");
      assert.equal("CA 000-000", results);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to clear all registrations from the database", async function () {
    try {
      const registrationData = RegistrationData(db);
      await registrationData.clearAll();

      await registrationData.captureReg("CA 222-000", 2);
      await registrationData.captureReg("CA 000-000", 2);
      await registrationData.captureReg("CJ 400-500", 4);
      await registrationData.captureReg("CY 222-300", 1);
      await registrationData.filterReg("all");
      registrationData.clearAll();
      let results = await registrationData.allRegistrations();
      assert.deepEqual([], results);
    } catch (err) {
      console.log(err);
    }
  });
  after(function () {
    pgp.end();
  });
});
