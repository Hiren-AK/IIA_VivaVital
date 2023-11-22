import axios from 'axios';

function keepWithinBounds(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Main function to calculate daily calories
async function calculateIdealWeight(userID) {
    const response = await axios.post('http://localhost:8001/getdemo', { userID: userID });
    const userData = response.data.data;
    const height = keepWithinBounds(userData.Height, 130, 230);
    const gender = userData.Gender;
    const options = {
        method: 'GET',
        url: 'https://fitness-calculator.p.rapidapi.com/idealweight',
        params: {
            height: height,
            gender: gender.toLowerCase()
        },
        headers: {
            'X-RapidAPI-Key': 'b791345cc5msh7b0ad5f3214240bp1411c5jsncfad6f862c01',
            'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return(response.data.data.Devine);
        // Here you can further process the response or send it to the frontend
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
}

export default calculateIdealWeight;
