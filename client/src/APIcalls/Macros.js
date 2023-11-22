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
async function calculateMacros(userID) {
    const response = await axios.post('http://localhost:8001/getdemo', { userID: userID });
    const userData = response.data.data;
    const age = calculateAge(userData.Birthdate);
    const weight = keepWithinBounds(userData.Weight, 40, 160);
    const height = keepWithinBounds(userData.Height, 130, 230);
    const goal = userData.Goal;
    const lst = userData.Activitylevel.slice(-1);
    const num = parseInt(lst);
    const options = {
        method: 'GET',
        url: 'https://fitness-calculator.p.rapidapi.com/macrocalculator',
        params: {
            age: age,
            gender: userData.Gender.toLowerCase(),
            height: height,
            weight: weight,
            activitylevel: num,
            goal: goal
        },
        headers: {
            'X-RapidAPI-Key': 'b791345cc5msh7b0ad5f3214240bp1411c5jsncfad6f862c01',
            'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data.data);
        const flatData = {
            calorie: response.data.data.calorie,
            balanced_protein: response.data.data.balanced.protein,
            balanced_fat: response.data.data.balanced.fat,
            balanced_carbs: response.data.data.balanced.carbs,
            highprotein_protein: response.data.data.highprotein.protein,
            highprotein_fat: response.data.data.highprotein.fat,
            highprotein_carbs: response.data.data.highprotein.carbs,
            lowcarbs_protein: response.data.data.lowcarbs.protein,
            lowcarbs_fat: response.data.data.lowcarbs.fat,
            lowcarbs_carbs: response.data.data.lowcarbs.carbs,
            lowfat_protein: response.data.data.lowfat.protein,
            lowfat_fat: response.data.data.lowfat.fat,
            lowfat_carbs: response.data.data.lowfat.carbs
        };
        console.log(flatData);
        return(flatData);
        // Here you can further process the response or send it to the frontend
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
}

export default calculateMacros;