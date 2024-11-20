const request = require("supertest");
const app = require("../../server"); // Import the app instance for testing
const userData = require("../../MOCK_DATA.json");

describe("API Integration Tests", () => {
  // Test for GraphQL API to get all users
  it("should fetch all users via GraphQL", async () => {
    const query = `
      {
        getAllUsers {
          id
          firstName
          lastName
          email
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.data.getAllUsers.length).toBeGreaterThan(0); // Ensure users are returned
    expect(response.body.data.getAllUsers[0]).toHaveProperty("id");
    expect(response.body.data.getAllUsers[0]).toHaveProperty("firstName");
  });

  // Test for GraphQL API to create a new user
  it("should create a new user via GraphQL", async () => {
    const mutation = `
      mutation {
        createUser(firstName: "John", lastName: "Doe", email: "john.doe@example.com", password: "password123") {
          id
          firstName
          lastName
          email
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.data.createUser).toHaveProperty("id");
    expect(response.body.data.createUser.firstName).toBe("John");
    expect(response.body.data.createUser.lastName).toBe("Doe");
  });

  // Test for REST API to get all users
  it("should fetch all users via REST API", async () => {
    const response = await request(app).get("/rest/getAllUsers");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Check if users are returned
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("firstName");
  });

  // Test for REST API to get a single user by ID
  it("should fetch a single user by ID via REST API", async () => {
    const userId = userData[0].id; // Assuming userData[0] exists
    const response = await request(app).get(`/rest/getUserById?id=${userId}`);
  
    expect(response.status).toBe(200); // Expecting status 200 if user is found
    expect(response.body).toHaveProperty("id", userId); // The response should contain the user with the correct ID
    expect(response.body).toHaveProperty("firstName"); // Ensure firstName is included
  });
});
