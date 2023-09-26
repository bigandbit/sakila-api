import express from 'express';
import {readFile} from 'fs/promises';
import * as actorModel from '../model/actor.model.js';
import validate from '../utils/validate.js';

const router = express.Router();
const schema = JSON.parse(await readFile(new URL('../schemas/actor.json', import.meta.url)));

export default router;

/**
 * @swagger
 * /api/actor:
 *   get:
 *     summary: Get all actor
 *     responses:
 *       200:
 *         description: Returns a list of actor
 */
router.get('/', async function(req, res){
    const list = await actorModel.findAll();
    return res.status(200).json(list);
});

/**
 * @swagger
 * /api/actor/{id}:
 *   get:
 *     summary: Get an actor by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of actor.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No actor found
 *       200:
 *         description: Returns an actor
 */
router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const actor = await actorModel.findById(id);
    if (actor === null) {
        return res.status(204).end();
    }
    return res.json(actor);
});

/**
 * @swagger
 * /api/actor:
 *   post:
 *     summary: Create a new actor
 *     description: Create a new actor with the provided details.
 *     requestBody:
 *       description: Actor details to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Actor created successfully
 *       400:
 *         description: Bad request, invalid data
 */
router.post('/', validate(schema), async function(req, res){
    let actor = req.body;
    const ret = await actorModel.add(actor);

    actor = {
        actor_id: ret[0],
        ...actor
    }
    return res.status(201).json(actor);
});

/**
 * @swagger
 * /api/actor/{id}:
 *   delete:
 *     summary: Delete an actor by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of actor.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Number of deleted actor
 */
router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    const n = await actorModel.del(id);
    return res.status(200).json({
        affected: n
    });
});

/**
 * @swagger
 * /api/actor/{id}:
 *   patch:
 *     summary: update a actor by id
 *     description: update a new actor with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of actor.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Actor details to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Actor created successfully
 *       400:
 *         description: Bad request, invalid data
 */
router.patch('/:id', validate(schema), async function(req, res){
    const id = req.params.id || 0;
    const actor = req.body;
    const n = await actorModel.patch(id, actor);
    return res.status(200).json({
        affected: n
    });
});