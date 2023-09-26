import database from "../utils/database.js";

export function findAll(){
    return database('actor');
}

export async function findById(id){
    const list = await database('actor').where('actor_id', id);
    if (list.length === 0) {
        return null;
    }
    return list[0];
}

export function add(actor){
    return database('actor').insert(actor);
}

export function del(id){
    return database('actor').where('actor_id', id).del();
}

export function patch(id, actor){
    return database('actor').where('actor_id', id).update(actor);
}