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
async function calculateDailyCalories(userID) {
    const response = await axios.post('http://localhost:8001/getdemo', { userID: userID });
    const userData = response.data.data;
    const age = calculateAge(userData.Birthdate);
    const weight = keepWithinBounds(userData.Weight, 40, 160);
    const height = keepWithinBounds(userData.Height, 130, 230);
    const goal = userData.Goal;
    const mapping = {
        "maintain": "maintain weight",
        "mildlose": "Mild weight loss",
        "weightlose": "Weight loss",
        "extremelose": "Extreme weight loss",
        "mildgain": "Mild weight gain",
        "weightgain": "Weight gain",
        "extremegain": "Extreme weight gain"
    };

    const options = {
        method: 'GET',
        url: 'https://fitness-calculator.p.rapidapi.com/dailycalorie',
        params: {
            age: age,
            gender: userData.Gender.toLowerCase(),
            height: height,
            weight: weight,
            activitylevel: userData.Activitylevel
        },
        headers: {
            'X-RapidAPI-Key': 'b791345cc5msh7b0ad5f3214240bp1411c5jsncfad6f862c01',
            'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
    };

    try {
        console.log("Check1 from DailyCalories");
        const response = await axios.request(options);
        console.log("Check2 from DailyCalories");
        console.log(response.data);
        const goals = response.data.data.goals;
        console.log(goals);
        const valueToFind = mapping[goal];
        console.log(valueToFind);
        if (valueToFind === "maintain weight"){
            return(goals[valueToFind]);
        }
        else{
            return(goals[valueToFind].calory);
        }
        // Here you can further process the response or send it to the frontend
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
}

export default calculateDailyCalories;
