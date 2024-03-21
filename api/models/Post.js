const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: {
    data: Buffer, // Store binary image data
    contentType: String // Store the content type of the image
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;