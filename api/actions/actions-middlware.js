// add middlewares here related to actions
const Action = require('./actions-model')

async function validateActionId(req, res, next){
    try{
        const action = await Action.get(req.params.id)
        if(!action){
            res.status(404).json({message: 'No actions were found with that ID'})
        } else{
            req.action = action
            next()
        }
    }catch(err){
        res.status(500).json({message: 'an error occured, action not found'})
    }
}

async function validateAction(req, res, next) {
    const { project_id, description, notes, completed } = req.body;

    if (!project_id) {
        return res.status(400).json({ message: 'Missing required project id' });
    }

    if (!notes || !notes.trim()) {
        return res.status(400).json({ message: 'Missing required project notes' });
    }

    // Set cleaned and validated values to request object
    req.project_id = project_id;
    req.description = description ? description.trim() : null;
    req.notes = notes.trim();
    req.completed = completed;

    next(); // Proceed to the next middleware or route handler
}

module.exports = {
    validateActionId, 
    validateAction
}