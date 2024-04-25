/*
  Documentation for use this function

  const { Worker } = require('worker_threads');

  const worker = new Worker('/path/to/filterByLang.js');
  worker.postMessage({ items: data, lang: 'uz', fields: ['productTitle', 'descriptionUz', 'category.categroyName'] });
  worker.on('message', (result) => {
    console.log(result); // or res.json(result)
  });
*/


const { parentPort } = require('worker_threads');

// Function to filter items based on language and specified fields
const filterByLang = (items = [], lang, ...fields) => {
    try {
        // Capitalize the first letter of the language and convert the rest to lowercase
        const langSuffix = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase().trim();

        // Initialize an empty array to store filtered items
        const result = [];

        // Iterate through each item in the items array
        for (let item of items) {
            // Create a shallow copy of the item (_doc is a property used by Mongoose)
            let newItem = { ...(item._doc || item) };

            // Iterate through each specified field
            for (let field of fields) {
                // Split the field path by dot to handle nested fields
                let fieldPath = field.split(".");
                let currentValue = newItem;

                // Traverse the nested field path
                for (let i = 0; i < fieldPath.length - 1; i++) {
                    currentValue = currentValue[fieldPath[i]];

                    // Break the loop if the current value is undefined (field does not exist)
                    if (currentValue === undefined) {
                        break;
                    }
                }

                // If the current value exists
                if (currentValue !== undefined) {
                    // Get the last key in the field path
                    const lastKey = fieldPath[fieldPath.length - 1];

                    // Update the value of the last key based on the language suffix
                    currentValue[lastKey] =
                        currentValue[`${lastKey}${langSuffix}`] || currentValue[lastKey];
                }
            }

            // Push the modified item to the result array
            result.push(newItem);
        }

        // Return the filtered items
        return result;
    } catch (err) {
        // If an error occurs, return an error message
        return {
            message: err,
            error: 'Error in filtering by language.',
        };
    }
};

// Listen for messages from the parent thread
parentPort.on('message', ({ items, lang, fields }) => {
    // Call the filterByLang function with the received parameters
    const result = filterByLang(items, lang, ...fields);
    // Send the filtered result back to the parent thread
    parentPort.postMessage(result);
});
