import express from 'express';
import {readFile} from 'fs/promises';
import * as actorModel from '../model/actor.model.js';
import validate from '../utils/validate.js';

const router = express.Router();
const schema = JSON.parse(await readFile(new URL('../schemas/actor.json', import.meta.url)));

export default router;

router.get('/', async function(req, res){
    const list = await actorModel.findAll();
    return res.status(200).json(list);
});
0
router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const actor = await actorModel.findById(id);
    if (actor === null) {
        return res.status(204).end();
    }
    return res.json(actor);
});


router.post('/', validate(schema), async function(req, res){
    let actor = req.body;
    const ret = await actorModel.add(actor);

    actor = {
        actor_id: ret[0],
        ...actor
    }
    return res.status(201).json(actor);
});


router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    const n = await actorModel.del(id);
    return res.status(200).json({
        affected: n
    });
});


router.patch('/:id', validate(schema), async function(req, res){
    const id = req.params.id || 0;
    const actor = req.body;
    const n = await actorModel.patch(id, actor);
    return res.status(200).json({
        affected: n
    });
});