const userModel = require("../../models/user");
const redis = require("../../config/redis");


const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName , lastName} = req.body;

        // Validate input
        if (!firstName || !lastName) {
            return res.status(400).json({ status: "fail", message: "All fields are required" });
        }

        // Update user details in the database
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { firstName : firstName , lastName : lastName },
            { new: true, runValidators: true }
        );

        console.log("Updated User: ", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }


        await redis.del(`user:${userId}`); 

        return res.status(200).json({
            status: "success",
            message: "User details updated successfully",
            data: updatedUser,
        });

    } catch (err) {
        return res.status(500).json({ status: "fail", message: "Something went wrong: " + err.message });
    }
}

module.exports = updateUserDetails;