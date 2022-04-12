const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const librarian = {
   email: "librarian@gmail.com",
   password: "vanquy1306",
};
const member = {
   email: "member1@gmail.com",
   password: "vanquy1306",
};
const librarianToken =
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ2NjdjMjMyYWI4OGYyYTQxMmM1NGQiLCJpYXQiOjE2NDkzMTE4NTR9.gDUtASurjCTlvg7-3y2dy8a-Xo3GiDKQgYeybRLGSh8";
const memberToken =
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ2YjcwYjI0ODk3YzNmOGUyMjllODAiLCJpYXQiOjE2NDkyMzQzMzZ9.V8uELcefWTpKuVuAki_sHN9AMMtU9ZnmGQrQxZypyzk";
const invalidToken = "";

describe("Should login for a user", () => {
   // afterAll(async () => {
   //   await mongoose.connection.close();
   // });
   test("should return status 200 when email and password is true", async () => {
      const res = await request(app).post("/api/signin").send({
         email: librarian.email,
         password: librarian.password,
      });

      const librarianToken = Object.values(res.headers["set-cookie"])[0];
      const myArray = librarianToken.split("t=");
      console.log("my arr", myArray);
      const newarr = myArray[1].split("; Path=/")[0];
      console.log(newarr);

      expect(res.statusCode).toBe(200);
      //   expect(res.body.message).toBe("Login Successfully");
   });

   test("should return status 401 when email is false", async () => {
      const res = await request(app).post("/api/signin").send({
         email: "quyvancccccdda@gmail.com",
         password: "vanquy1306",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe(
         "User with that email does not exist. Please signup"
      );
   });

   test("should return status 401 when password is false", async () => {
      const res = await request(app).post("/api/signin").send({
         email: "librarian@gmail.com",
         password: "1231234",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Email and password dont match");
   });
});
describe("Should add member by admin", () => {
   // afterAll(async () => {
   //   await mongoose.connection.close();
   // });

   test("should rerutn status 403 when invalid token", async () => {
      const res = await request(app)
         .post("/api/librarian/addmember")
         .send({
            name: "Van Quy",
            email: "vanquykute@gmail.com",
            password: "vanquy1306",
         })
         .set("authorization", invalidToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe(
         "You are not allowed to do that. Please login..."
      );
   });
   test("should rerutn status 403 when not allowed", async () => {
      const res = await request(app)
         .post("/api/librarian/addmember")
         .send({
            name: "Van Quy",
            email: "vanquykute@gmail.com",
            password: "vanquy1306",
         })
         .set("authorization", memberToken);

      expect(res.body.error).toBe("Invalid token.");
      expect(res.statusCode).toBe(403);
   });
   // test("should return status 400 when email exist", async () => {
   //    const reslogin = await request(app).post("/api/signin").send({
   //       email: librarian.email,
   //       password: librarian.password,
   //    });
   //    // const librarianToken = reslogin;
   //    // console.log("tes2t", librarianToken);

   //    // const librarianToken = Object.values(reslogin.headers["set-cookie"])[0];
   //    // const myArray = librarianToken.split("t=");
   //    // // console.log("my arr", myArray);
   //    // const newarr = myArray[1].split("; Path=/")[0];
   //    // const librarianTokenn = reslogin._body.token;
   //    // console.log("test", librarianTokenn);

   //    if (librarianTokenn === librarianToken) {
   //       const res = await request(app)
   //          .post("/api/librarian/addmember")
   //          .send({
   //             name: "van quy",
   //             email: "vanquy.devplus@gmail.com",
   //             password: "vanquy1306",
   //          })
   //          .set("authorization", librarianTokenn);
   //       expect(res.statusCode).toBe(403);
   //       console.log(res);
   // expect(res.body.err).toBe("Email is already exists");
   // err: "Email is already exists"
   //    }
   //    // const res = await request(app)
   //    //    .post("/api/librarian/addmember")
   //    //    .send({
   //    //       name: "van quy",
   //    //       email: "vanquy.devplus@gmail.com",
   //    //       password: "vanquy1306",
   //    //    })
   //    //    .set("authorization", librarianTokenn);
   //    // expect(res.statusCode).toBe(403);
   //    // console.log(res.body);
   //    // expect(res.body.messenger).toBe("Email is already exists");
   // });
});
describe("Should get list book for a user", () => {
   // afterAll(async () => {
   //   await mongoose.connection.close();
   // });
   test("should return status 200 when get list book", async () => {
      const res = await request(app).get("/api/book/listbook").send({});
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
   });
});
describe("given the user is logged in", () => {
   it("should return a 200 and create the product", async () => {
      const signJwt = jwt.sign(librarian, process.env.JWT_SECRET);
      console.log(signJwt, "jasdasdsadsad");
      const { statusCode, body } = await request(app)
         .post("/api/librarian/addmember")
         .set("Authorization", `Bearer ${signJwt}`)
         .send(member);
      console.log(body);

      expect(statusCode).toBe(200);
      //   expect(body).toEqual({

      //   });
   });
});
