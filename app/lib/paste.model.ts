import { model, models, Schema } from "mongoose";

const pasteSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: {expireAfterSeconds: 0}
    },

    maxViews: {
      type: Number,
      default: null,
      min: 1
    },

    viewsUsed: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    versionKey: false
  }
);

const Paste = models.Paste || model("Paste", pasteSchema);

export default Paste
