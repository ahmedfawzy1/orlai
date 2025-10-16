import User from "../models/user.model.js";

// Get all customers with pagination and search
export const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await User.find(searchQuery).select("-password -otp -otpExpiration").skip(skip).limit(limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      customers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCustomers: total,
    });
  } catch (error) {
    console.error("Error in getCustomers:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";

    // Only admin can update
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can update customer information" });
    }

    const { first_name, last_name, email } = req.body;

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const customer = await User.findOneAndUpdate({ _id: req.params.id }, updateData, { new: true, runValidators: true }).select(
      "-password -otp -otpExpiration"
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if trying to delete an admin
    if (customer.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
