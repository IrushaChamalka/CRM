import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Lead ID is required"],
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
    createdBy: {
      type: String,
      required: [true, "Created by is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ leadId: 1 });

const Note = mongoose.model("Note", noteSchema);
export default Note;
