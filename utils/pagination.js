/*
  Documentation for use this function.

  const paginate = require('/path/to/paginate');

  const result = await paginate(Model, req.query, Population: 'example', 'population')

  console.log(result)
*/

const sortFn = (sort) => {
  let sortOption = {};
  if (sort) {
    const sortFields = sort.split(","); // Split the sort string into an array of fields
    sortFields.forEach((field) => {
      const sortOrder = field.startsWith("-") ? -1 : 1; // If the field starts with '-', set sortOrder to -1 (descending), otherwise set it to 1 (ascending)
      const fieldName = field.replace(/^-/, ""); // Remove '-' from the field name if it exists
      sortOption[fieldName] = sortOrder; // Add the field and its sortOrder to the sortOption object
    });
  }
  return sortOption; // Return the sortOption object containing sort fields and their orders
};

const paginate = async (model, query, ...populateFields) => {
  try {
    const { page = 1, perPage = 10, includes, sort, filter} = query; // Destructure query object to get page, perPage, includes, sort, and filter
    const sortOption = sortFn(sort); // Get the sortOption object based on the sort parameter
    const selectFields = includes ? includes.replace(/,/g, " ") : ""; // If includes exist, replace commas with space
    const results = await model
      .find(filter) // Find documents based on the filter
      .select(selectFields) // Select fields based on includes
      .skip((page - 1) * perPage) // Skip documents based on pagination
      .sort(sortOption) // Sort documents based on sortOption
      .limit(perPage); // Limit the number of documents per page

    let populatedResults = results;

    // Populate additional fields if provided
    for (const field of populateFields) {
      populatedResults = populatedResults.populate(field);
    }

    // Get total count of documents in the model
    const totalCount = await model.countDocuments();
    // Calculate total pages based on totalCount and perPage
    const totalPages = Math.ceil(totalCount / perPage);

    return {
      data: populatedResults, // Return the paginated and populated results
      _meta: {
        currentPage: +page, // Current page number
        perPage: +perPage, // Number of documents per page
        totalCount, // Total count of documents
        totalPages, // Total number of pages
      },
    };
  } catch (error) {
    // If an error occurs, return an error message
    return {
      message: "Error occurred while paginating results",
      error: error.message,
    };
  }
};

module.exports = paginate; // Export the paginate function
