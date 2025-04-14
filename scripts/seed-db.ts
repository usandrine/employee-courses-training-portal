import { MongoClient } from 'mongodb'
import 'dotenv/config'; // Add this at the top
import clientPromise from "../lib/mongodb";
import { courses } from "../data/courses";

async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("emplyee_db"); // Make sure this matches your database name
    
    // Check if courses collection already has data
    const coursesCollection = db.collection("courses");
    const courseCount = await coursesCollection.countDocuments();
    
    if (courseCount === 0) {
      console.log("Seeding courses collection...");
      await coursesCollection.insertMany(courses);
      console.log(`Inserted ${courses.length} courses`);
    } else {
      console.log(`Courses collection already has ${courseCount} documents. Skipping seed.`);
    }
    
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0); // Add this to ensure the script exits
  }
}

// Run the seed function
seedDatabase();