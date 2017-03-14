const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  name: 'MergeRequest',
  schema: new Schema({
    merge_request: {
      id: Number,
      url: String,
      target_branch: String,
      source_branch: String,
      created_at: String,
      updated_at: String,
      title: String,
      description: String,
      status: String,
      work_in_progress: Boolean
    },
    last_commit: {
      id: String,
      message: String,
      timestamp: String,
      url: String,
      author: {
        name: String,
        email: String
      }
    },
    project: {
      name: String,
      namespace: String
    },
    author: {
      name: String,
      username: String
    },
    assignee: {
      claimed_on_slack: Boolean,
      name: String,
      username: String
    }
  })
}
