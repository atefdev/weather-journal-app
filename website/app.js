/* Global Variables */
// the URL & my personal API key
const baseUrl ='http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=f56a4ff590bb577ea0e7a7e875d387c1&units=imperial'; 


// Create a new date instance dynamically with JS
let d = new Date();

// added +1 for the d.getMonth() gives the right currently Month, because the index starting from zero
let newDate = (d.getMonth() +1) + '.' + d.getDate() + '.' + d.getFullYear();


// const myInfo = document.getElementById('userInfo');

// Event listener to add function to existing HTML DOM element
const clickBtn = document.getElementById('generate');
clickBtn.addEventListener('click', myAction);

/* Function called by event listener */
function myAction() {

    //get informations from  the  user
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    if (zipCode !== '' || !zipCode) {
        clickBtn.classList.remove('invalid');
        getWeather(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add data to POST request
                postData('/add', { temp:(data.main.temp), date: newDate, content: content });
            }).then(function() {
                // call updateUI to update browser content
                updateUI()
            }).catch(function(error) {
                console.log(error);
                alert('somthing went wrong');
            });
  
    } else {
        clickBtn.classList.add('invalid');
    }


}

/* Function to GET Web API Data*/
const getWeather = async(baseUrl, zipCode, apiKey) => {
    const res = await fetch(baseUrl + zipCode + apiKey);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

//upata UI
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update the data
        if (allData.date !== undefined && allData.temp !== undefined && allData.content !== undefined) {
            document.getElementById('date').innerHTML = `Date is: ${allData.date}`;
            document.getElementById('temp').innerHTML = `Temp is: ${allData.temp} `;
            document.getElementById('content').innerHTML = `Feeling is: ${allData.content}`;
        }
    } catch (error) {
        console.log('error', error);
    }
};

