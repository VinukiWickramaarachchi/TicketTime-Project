// Dummy users
const users = {
  vendors: [
    { id: "v1", username: "vendor1", password: "pass123", role: "vendor" },
    { id: "v2", username: "vendor2", password: "pass456", role: "vendor" },
  ],
  customers: [
    {
      id: "c1",
      username: "customer1",
      password: "cust123",
      role: "customer",
      isVIP: false,
    },
    {
      id: "c2",
      username: "customer2",
      password: "cust123",
      role: "customer",
      isVIP: false,
    },
    {
      id: "c2",
      username: "vipCustomer",
      password: "vip123",
      role: "customer",
      isVIP: true,
    },
  ],
};

module.exports = users;
