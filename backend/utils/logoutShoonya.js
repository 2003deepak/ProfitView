const axios = require('axios');

const logoutShoonya = async (req, res) => {
    try {
        const response = await axios.post('https://api.shoonya.com/NorenWClientTP/Logout', null, {  // No body, only headers
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,  // Ensure this token is valid
            },
        });

        const data = response.data;  // ✅ axios puts response JSON data here
        console.log("Shoonya Logout Response:", data);

        if (data.status === 'success') {
            console.log('Logged out successfully');
            return res.status(200).json({ status: "success", message: "Logged out successfully" });
        } else {
            console.error('Logout failed:', data.message);
            return res.status(500).json({ status: "fail", message: "Logout failed from Shoonya API", error: data.message });
        }

    } catch (error) {
        console.error("Error during Shoonya Logout:", error.response?.data || error.message);
        return res.status(500).json({ status: "fail", message: "Internal server error", error: error.response?.data || error.message });
    }
};

module.exports = { logoutShoonya };
