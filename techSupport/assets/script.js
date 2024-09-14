const apiKey = 'AIzaSyAosAehTaSmL8uCDsOVCGeB32M2LJTsCwE'; // Replace with your actual API key
const spreadsheetId = '1hnv1gNZNvL3l31Jz2hGDc2uEnogcd5WkHWOB1e4Cz4w'; // Replace with your actual spreadsheet ID
const range = 'techSupport!A1:I'; // Specify the range of cells you want to fetch, adjust H as per your sheet's columns


// Variable to set how many rows to display
let rowsToDisplay = 10; // Change this value to display a different number of rows ( Default Rows )
let loadMoreRows = 10;  // Load More Rows

// Function to fetch data from Google Sheets API
async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        processData(data.values);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, show error message, etc.
    }
}

// Function to process and display the data
function processData(values) {
    if (!values || values.length === 0) {
        return;
    }

    const headers = values[0]; // First row contains headers
    // Find the table headers in HTML
    const tableHeaders = document.querySelectorAll('#pending thead th');

    // Clear any existing data in the table body
    const tableBody = document.getElementById('tickets');
    tableBody.innerHTML = '';

    // Find index positions of headers from Google Sheet in HTML table headers
    const headerIndexes = [];
    headers.forEach((header, index) => {
        const foundHeader = Array.from(tableHeaders).find(th => th.textContent.trim() === header.trim());
        if (foundHeader) {
            headerIndexes.push(index);
        }
    });

    // Select the last 'rowsToDisplay' rows, if there are less than 'rowsToDisplay' rows, select all excluding the header
    const dataRows = values.length > rowsToDisplay + 1 ? values.slice(-rowsToDisplay) : values.slice(1);

    // Reverse the data rows to display last row first
    const reversedDataRows = dataRows.reverse();

    // Populate data rows in the table body
    reversedDataRows.forEach(row => {
        const tr = document.createElement('tr');
        headerIndexes.forEach(index => {
            const td = document.createElement('td');
            td.textContent = row[index] || ''; // Use empty string if cell is empty
            tr.appendChild(td);
        });

        // Create Resolve Action button in the last column (index 7, 8th column)
        const actionTd = document.createElement('td');
        const resolveButton = document.createElement('button');
        resolveButton.textContent = 'Resolved ?';
        resolveButton.addEventListener('click', () => {
            document.querySelector("#resolvedForm").style.cssText= "opacity:1; position:fixed; bottom:10%;";
            document.querySelector("#resolvedId").setAttribute("value", `${row[0]}`); ;
        });
        actionTd.appendChild(resolveButton);
        tr.appendChild(actionTd);
        tableBody.appendChild(tr);
    });
}

// Call fetchData function when the page loads
window.onload = function() {
    fetchData();
};


// Resolve Action 
document.querySelector("#cencelBtn").addEventListener("click", function(){
    document.querySelector("#resolvedForm").style.cssText= "opacity:0; position:fixed; bottom:-30%;";;
})
document.getElementById('resolutionTime').value=(function(){const now=new Date(),year=now.getFullYear(),month=String(now.getMonth()+1).padStart(2,'0'),day=String(now.getDate()).padStart(2,'0'),hours=String(now.getHours()).padStart(2,'0'),minutes=String(now.getMinutes()).padStart(2,'0'),seconds=String(now.getSeconds()).padStart(2,'0');return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`})();

// Load More
document.querySelector(".loadMore").addEventListener("click", function(){
    console.log("working")
    rowsToDisplay = rowsToDisplay + loadMoreRows;
    fetchData();  
})



// Count Pending
const url = 'https://sheets.googleapis.com/v4/spreadsheets/1hnv1gNZNvL3l31Jz2hGDc2uEnogcd5WkHWOB1e4Cz4w/values/techSupport!H3:H?key=AIzaSyAosAehTaSmL8uCDsOVCGeB32M2LJTsCwE';
// Make an HTTP GET request to the Google Sheets API
function updatePending(){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.values && data.values.length > 0) {
        const pendingCount = data.values.filter(row => row[0].toLowerCase() === 'pending').length;
        document.querySelector(".pendingCount").textContent = pendingCount;
        } else {
        console.log('No data found.');
        }
    })
    .catch(error => console.error('Error retrieving data from sheet:', error));
}
updatePending();



// Update Data Live
// function updateData(){
//     updatePending();
//     fetchData()
// }
// setInterval(updateData, 1000)