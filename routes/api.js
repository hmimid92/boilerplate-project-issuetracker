'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const IssueSchema = new Schema({
  assigned_to: String,
  status_text: String,
  open: Boolean,
  project_id: { required: true, type: String },
  issue_title: { required: true, type: String },
  issue_text: { required: true, type: String },
  created_by: { required: true, type: String },
  created_on: Date,
  updated_on: Date
});

const Issue = mongoose.model("Issue", IssueSchema);

const ProjectSchema = new Schema({
  projectName: { required: true, type: String },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      let project = req.params.project;
      try {
        let projectName = await Project.findOne({projectName: project});
        if (Object.values(req.query).length === 0) {
          const issues = await Issue.find({project_id: projectName._id}).select("-__v");
          res.json(issues);
        } else {
          let issueFilter = {}
          if (req.query.open) {
            issueFilter["open"] = req.query.open
          }
          if (req.query.assigned_to) {
            issueFilter["assigned_to"] = req.query.assigned_to
          }
          if (req.query.issue_title) {
            issueFilter["issue_title"] = req.query.issue_title
          }
          if (req.query.issue_text) {
            issueFilter["issue_text"] = req.query.issue_text
          }
          if (req.query.created_by) {
            issueFilter["created_by"] = req.query.created_by
          }
          if (req.query.status_text) {
            issueFilter["status_text"] = req.query.status_text
          }
          if (req.query.created_on) {
            issueFilter["created_on"] = req.query.created_on
          }
          if (req.query.updated_on) {
            issueFilter["updated_on"] = req.query.updated_on
          }
          if (req.query._id) {
            issueFilter["_id"] = req.query._id
          }
          if (req.query.project_id) {
            issueFilter["project_id"] = req.query.project_id
          }
          const issuesFilter = await Issue.find(issueFilter).select("-__v");
          res.json(issuesFilter);
        }
      } catch (error) {
        res.send(error);
      }

    })

    .post(async (req, res) => {
      let project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      } 
      try {
        let projectNameNew = await Project.findOne({projectName: project});
        if(!projectNameNew) {
          projectNameNew = new Project({
            projectName: project
          });
          projectNameNew = await projectNameNew.save();
        }
        const issueNew = new Issue({
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          open: true,
          project_id: projectNameNew._id,
          issue_title: req.body.issue_title || "",
          issue_text: req.body.issue_text || "",
          created_by: req.body.created_by,
          created_on: new Date(Date.now()) || "",
          updated_on: new Date(Date.now()) || ""
        });
        let issueSaved = await issueNew.save();
        res.json(issueSaved);
      } catch (error) {
        res.json({ error: 'could not post' });
      }
          
          // const issueToSave = {
          //   assigned_to: issueNew.assigned_to,
          //   status_text: issueNew.status_text,
          //   open: issueNew.open,
          //   _id: issueNew._id,
          //   issue_title: issueNew.issue_title,
          //   issue_text: issueNew.issue_text,
          //   created_by: issueNew.created_by,
          //   created_on: issueNew.created_on,
          //   updated_on: issueNew.updated_on
          // };
    })

    .put(function (req, res) {
      // let project = req.params.project;
      // if(req.body._id === "") {
      //   res.json({ error: 'missing _id' })
      // } else {
      //   let id_issue = await Issue.findById(req.body._id);
      //   if(id_issue) {
      //     let issueUpdated = Issue.findByIdAndUpdate(req.body._id, 
      //       { 
      //          assigned_to: req.body.assigned_to,
      //          status_text: req.body.status_text,
      //          open: req.body.open, 
      //          issue_title: req.body.issue_title,
      //          issue_text: req.body.issue_text,
      //          created_by: req.body.created_by,
      //          updated_on: new Date(Date.now()).toString()
      //       }, {new: true});
      //      if(!Object.keys(issueUpdated._update).includes("updated_on")) {
      //       res.json({ error: 'no update field(s) sent', '_id': req.body._id });
      //      } else {
      //       res.json({ result: 'successfully updated', '_id': req.body._id });
      //      }
      //   } else {
      //     res.json({ error: 'could not update', '_id': req.body._id });
      //   }
      // }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      // try {
      //   const IssueDelete = await  Issue.findOneAndDelete({_id: req.body._id})
      //   if (!IssueDelete) {
      //      res.json({ error: 'missing _id' });
      //   } else {
      //     res.json({ result: 'successfully deleted', '_id': req.body._id });
      //   }
      //      res.status(200).send("Id " + req.params.id + " has been deleted");
      // } catch (err) {
      //      res.json({ error: 'could not delete', '_id': req.body._id });
      // }
    });

};
