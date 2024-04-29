// Write your "actions" router here!
const express = require('express')
const router = express.Router()
const Actions = require("./actions-model")
const {validateActionId, validateAction } = require('./actions-middlware')

router.get('/', async (req, res, next) => {
    try {
        const actions = await Actions.get()
        res.status(200).json(actions)
    } catch(err) {
        next(err)
    }
})

router.get('/:id', validateActionId, async (req, res, next) => {
    try {
        res.status(200).json(req.action)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    const { project_id, description, notes } = req.body

    if (!project_id || !description || !notes) {
        return res.status(400).json({
            message: 'Missing required fields (project_id, description, notes)'
        });
    }

    try {
        const newAction = await Actions.insert(req.body)
        res.status(201).json(newAction)
    } catch(err) {
        next(err)
    }
});

router.put('/:id', validateActionId, validateAction, async (req, res, next) => {
    const { id } = req.params;
    const { project_id, description, notes, completed } = req.body;

    if (!project_id || !description || !notes || typeof completed !== 'boolean') {
        return res.status(400).json({
            message: 'Missing required fields (project_id, description, notes, completed)'
        });
    }

    try {
        const updatedAction = await Actions.update(id, {
            project_id,
            description,
            notes,
            completed
        });

        if (!updatedAction) {
            return res.status(404).json({
                message: 'Action not found'
            });
        }

        res.status(200).json(updatedAction);
    } catch (err) {
        next(err);
    }
});


router.delete('/:id', validateActionId, async (req, res, next) => {
    try {
        await Actions.remove(req.params.id)
        res.json(res.Action)
    } catch(err) {
        next(err)
    }
})


module.exports = router