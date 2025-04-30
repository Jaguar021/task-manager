const Client = require("../models/Client"); // Your Client model
const User = require("../models/User");

// Controller to update an existing client's details
const updateClient = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed in the URL
    const { name, email, phone, address, image } = req.body;

    // Find the client by userId
    const user = await User.findById(userId);
    //const client = await Client.findOne({ user: userId });
    console.log("Hello");
    console.log(user);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Update client details
    if (name) client.name = name;
    if (email) client.email = email;
    if (phone) client.phone = phone;
    if (address) client.address = address;
    if (image) client.image = image;  // Update image if new image URL is provided

    // Save the updated client
    await client.save();

    res.status(200).json({ message: "Client details updated successfully", client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateClient };
