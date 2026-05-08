import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import Note from "./models/Note.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Note.deleteMany({});
    console.log("Cleared existing data.");

    // Create test users
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const salesUser = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      role: "salesperson",
    });

    console.log("Created test users.");

    // Create sample leads
    const leads = await Lead.insertMany([
      {
        name: "John Doe",
        company: "Tech Corp",
        email: "john@techcorp.com",
        phone: "+1-555-0101",
        source: "Website",
        assignedTo: "Admin User",
        status: "New",
        dealValue: 15000,
      },
      {
        name: "Sarah Johnson",
        company: "Digital Solutions Ltd",
        email: "sarah@digitalsolutions.com",
        phone: "+1-555-0102",
        source: "LinkedIn",
        assignedTo: "Jane Smith",
        status: "Contacted",
        dealValue: 25000,
      },
      {
        name: "Mike Wilson",
        company: "Cloud Nine Inc",
        email: "mike@cloudnine.com",
        phone: "+1-555-0103",
        source: "Referral",
        assignedTo: "Admin User",
        status: "Qualified",
        dealValue: 50000,
      },
      {
        name: "Emily Chen",
        company: "DataFlow Systems",
        email: "emily@dataflow.com",
        phone: "+1-555-0104",
        source: "Cold Email",
        assignedTo: "Jane Smith",
        status: "Proposal Sent",
        dealValue: 35000,
      },
      {
        name: "Robert Brown",
        company: "InnovateTech",
        email: "robert@innovatetech.com",
        phone: "+1-555-0105",
        source: "Event",
        assignedTo: "Admin User",
        status: "Won",
        dealValue: 75000,
      },
      {
        name: "Lisa Anderson",
        company: "WebScale Co",
        email: "lisa@webscale.com",
        phone: "+1-555-0106",
        source: "Website",
        assignedTo: "Jane Smith",
        status: "Lost",
        dealValue: 20000,
      },
      {
        name: "David Martinez",
        company: "FutureSoft",
        email: "david@futuresoft.com",
        phone: "+1-555-0107",
        source: "LinkedIn",
        assignedTo: "Admin User",
        status: "New",
        dealValue: 40000,
      },
      {
        name: "Karen White",
        company: "SmartApps Inc",
        email: "karen@smartapps.com",
        phone: "+1-555-0108",
        source: "Referral",
        assignedTo: "Jane Smith",
        status: "Contacted",
        dealValue: 18000,
      },
      {
        name: "Tom Harris",
        company: "NextGen Solutions",
        email: "tom@nextgen.com",
        phone: "+1-555-0109",
        source: "Cold Email",
        assignedTo: "Admin User",
        status: "Won",
        dealValue: 60000,
      },
      {
        name: "Amanda Lee",
        company: "ByteForce",
        email: "amanda@byteforce.com",
        phone: "+1-555-0110",
        source: "Event",
        assignedTo: "Jane Smith",
        status: "Qualified",
        dealValue: 32000,
      },
    ]);

    console.log(`Created ${leads.length} sample leads.`);

    // Create sample notes
    const notes = await Note.insertMany([
      {
        leadId: leads[0]._id,
        content: "Initial contact via website form. Interested in our enterprise plan.",
        createdBy: "Admin User",
      },
      {
        leadId: leads[1]._id,
        content: "Had a call with Sarah. She wants a demo next week.",
        createdBy: "Jane Smith",
      },
      {
        leadId: leads[2]._id,
        content: "Mike is qualified. Budget approved internally. Scheduling proposal meeting.",
        createdBy: "Admin User",
      },
      {
        leadId: leads[3]._id,
        content: "Sent detailed proposal. Waiting for response by Friday.",
        createdBy: "Jane Smith",
      },
      {
        leadId: leads[4]._id,
        content: "Deal closed! Contract signed for 12-month engagement.",
        createdBy: "Admin User",
      },
      {
        leadId: leads[5]._id,
        content: "Lost to competitor. They went with a cheaper option.",
        createdBy: "Jane Smith",
      },
    ]);

    console.log(`Created ${notes.length} sample notes.`);
    console.log("\nSeed completed successfully!");
    console.log("\nTest credentials:");
    console.log("  Admin: admin@example.com / password123");
    console.log("  Sales: jane@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
