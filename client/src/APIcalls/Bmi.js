import axios from 'axios';

function calculateAge(birthdate) {
    const birthday = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    console.log(age);
    return Math.min(Math.max(age, 0), 80);
}

function keepWithinBounds(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Main function to calculate daily calories
async function calculateBmi(userID) {
    const response = await axios.post('http://localhost:8001/getdemo', { userID: userID });
    const userData = response.data.data;
    const age = calculateAge(userData.Birthdate);
    const weight = keepWithinBounds(userData.Weight, 40, 160);
    const height = keepWithinBounds(userData.Height, 130, 230);
    const options = {
        method: 'GET',
        url: 'https://fitness-calculator.p.rapidapi.com/bmi',
        params: {
            age: age,
            height: height,
            weight: weight
        },
        headers: {
            'X-RapidAPI-Key': 'b791345cc5msh7b0ad5f3214240bp1411c5jsncfad6f862c01',
            'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data.data.bmi);
        return(response.data.data.bmi);
        // Here you can further process the response or send it to the frontend
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
}

export default calculateBmi;
