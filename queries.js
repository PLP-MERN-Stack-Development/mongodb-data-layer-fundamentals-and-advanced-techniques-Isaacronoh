// queries.js
const { connectDB } = require('./db');

async function main() {
  const books = await connectDB();

  // READ: Find all books in a specific genre
  const fictionBooks = await books.find({ genre: "Fiction" }).toArray();
  console.log("📖 Fiction Books:", fictionBooks);

  // Find books published after a certain year
  const recentBooks = await books.find({ published_year: { $gt: 1940 } }).toArray();
  console.log("📅 Books published after 1940:", recentBooks);

  // Find books by a specific author
  const tolkienBooks = await books.find({ author: "J.R.R. Tolkien" }).toArray();
  console.log("✍️ Books by J.R.R. Tolkien:", tolkienBooks);

  // Update a book's price
  await books.updateOne(
    { title: "The Great Gatsby" },
    { $set: { price: 12.99 } }
  );
  console.log("🔄 Updated 'The Great Gatsby' price");

  // Delete a book
  await books.deleteOne({ title: "The Hobbit" });
  console.log("🗑️ Deleted 'The Hobbit'");

  // Create an aggregation pipeline to calculate the average price of books by genre
  const pipeline = [
    {
      $group: {
        _id: "$genre",
        averagePrice: { $avg: "$price" }
      }
    }
  ];

  const averagePrices = await books.aggregate(pipeline).toArray();
  console.log("📊 Average book prices by genre:", averagePrices);

  // Create an aggregation pipeline to find the author with the most books in the collection
  const authorPipeline = [
    {
      $group: {
        _id: "$author",
        bookCount: { $sum: 1 }
      }
    },
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
  ];

  const topAuthor = await books.aggregate(authorPipeline).toArray();
  console.log("🏆 Author with the most books:", topAuthor);

  // Implement a pipeline that groups books by publication decade and counts them
  const decadePipeline = [
    {
      $addFields: {
        decade: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] }
      }
    },
    {
      $group: {
        _id: "$decade",
        bookCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const booksByDecade = await books.aggregate(decadePipeline).toArray();
  console.log("📅 Books by Decade:", booksByDecade);

  // Create an index on the title field for faster searches
  await books.createIndex({ title: 1 });
  console.log("🏷️ Created index on title field");

  // Create a compound index on author and published_year
  await books.createIndex({ author: 1, published_year: 1 });
  console.log("🏷️ Created compound index on author and published_year");

  // Use the explain() method to demonstrate the performance improvement with your indexes
  const explainResult = await books.find({ title: "The Great Gatsby" }).explain();
  console.log("📊 Explain plan for finding 'The Great Gatsby':", explainResult);

  process.exit();
}

main();
