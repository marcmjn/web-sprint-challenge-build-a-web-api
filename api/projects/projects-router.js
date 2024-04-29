// Write your "projects" router here!
const express = require('express')
const router = express.Router()
const Projects = require("./projects-model")
const { validateProjectId, validateProject } = require('./projects-middleware')

router.get("/", async (req, res) => {
    try {
        const projects = await Projects.get()
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({
            message:'Unable to retieve information'
        })
    }
})

router.get("/:id", validateProjectId, async (req, res) => {
    const { id } = req.params
    try {
        const project = await Projects.get(id)
            if (!project) {
                return res.status(404).json({
                    message: 'project not found'
                })
            }
            res.status(200).json(project)
    } catch (error) {
        res.status(500).json({
            message: 'error retrieving project'
        })
    } 
})

router.post("/", (req, res) => {
    const newProject = req.body
    Projects.insert(newProject)
        .then(() => {
            res.status(201).json(newProject)
        })
        .catch(err => {
            res.status(400).json(err)
        })
})

router.put("/:id", validateProjectId, validateProject, async (req, res, next) => {
    const { name, description, completed } = req.body;
    const { id } = req.params;
  
    // Check if any required fields are missing in the request body
    if (!name || !description || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const updatedProject = await Projects.update(id, { name, description, completed });
  
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(updatedProject);
    } catch (err) {
      next(err);
    }
  });

router.delete("/:id", validateProjectId, async (req, res, next) => {
    try {
        await Projects.remove(req.params.id)
        res.json(res.Projects)
    } catch (err) {
        next(err)
    }
})

router.get("/:id/actions", async (req, res, next) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
            if (actions.length > 0) {
                res.status(200).json(actions)
            } else {
                res.status(404).json(actions)
            }
        })
        .catch(next)
})


module.exports = router