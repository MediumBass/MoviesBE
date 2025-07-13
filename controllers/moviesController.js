const fs = require('node:fs');
const Movie = require('../database/models/movie');
const Actor = require('../database/models/actor');
const {Op} = require('@sequelize/core');
const sendError = require('./methods/errorWrapper');

async function selectMovieWithActors(obj) {
        const movie = await Movie.findOne({
            where: obj,
            include: {
                model: Actor,
                through: {attributes: []}, // hide join table
            },
        });
        if(!movie){
            throw new sendError('Movie not found', 404, obj);
        }
        return movie;
}

async function createMovie(body) {
        const { title, year, format, actors } = body;
        try{
            const movie = await Movie.create({ title, year, format });
            for (const actorName of actors) {
                let actor = await Actor.findOne({ where: { name: actorName } });
                if (!actor) {
                    actor = await Actor.create({ name: actorName });
                }
                await movie.addActor(actor); //method created by sequelize
            }
            return selectMovieWithActors( { title, year } );
        }catch (e) {
            throw new sendError('Error creating new movie: ' + e.errors[0].message, 409, e.errors[0].value);
        }


}

function txtToJSON(file) {
    return new Promise((resolve) => {
        fs.readFile(file.path, 'utf-8', (err, text) => {
            if (err) {  throw new sendError('Failed to read File', 400, '.txt file');}

            fs.unlinkSync(file.path); // delete a temp file
            // this function split txt file to blocks by empty line, then each line converts to JSON
            const entries = text.trim().split(/\n\s*\n/);
            const movies = entries.map((block) => {
                const lines = block.split('\n');
                const titleLine = lines.find(line => line.startsWith('Title:'));
                const yearLine = lines.find(line => line.startsWith('Release Year:'));
                const formatLine = lines.find(line => line.startsWith('Format:'));
                const actorsLine = lines.find(line => line.startsWith('Stars:'));

                return {
                    title: titleLine?.replace('Title:', '').trim() || '',
                    year: parseInt(yearLine?.replace('Release Year:', '').trim()) || null,
                    format: formatLine?.replace('Format:', '').trim() || '',
                    actors: actorsLine?.replace('Stars:', '').trim().split(',').map(a => a.trim()) || [],
                };
            });

            resolve(movies);
        });
    });
}

            //CONTROLLER

class MoviesController {
    async importMovies(req, res) {
        if (!req.file) {throw new sendError('Key name of the file must be {movies}', 400, '.txt file');}
        if (req.file.mimetype !== 'text/plain') {
            fs.unlinkSync(req.file.path);
            throw new sendError('Only .txt files are allowed', 400, '.txt file');
        }
        const Json = await txtToJSON(req.file);
        const settled = await Promise.allSettled(Json.map(createMovie));
        const result = settled.filter(res => res.status === 'fulfilled').map(res => res.value);
        if (result.length===0){ throw new sendError('All listed movies are in wrong formate or already in database', 400, '.txt file');}
        return res.sendSuccess({key:'data', value:result});
    }
    async getOneMovie(req, res) {
        const id = req.params.id;
        const result = await selectMovieWithActors({'id':id});
        return res.sendSuccess( {key:'data', value:result});
    }
    async createNewMovie(req, res) {
        const result = await createMovie(req.body);
        return res.sendSuccess({key:'data', value:result});
    };
    async updateMovie(req, res){
            const id = req.params.id;
            const { title, year, format, actors } = req.body;
            try{
                const movie =await selectMovieWithActors({'id':id});
                await movie.update(
                    { title, year, format, actors },
                );
                const actorInstances = [];
                for (const name of actors) {
                    const [actor] = await Actor.findOrCreate({ where: { name } });
                    actorInstances.push(actor);
                }
                await movie.setActors(actorInstances);
                const result = await selectMovieWithActors({'id':id});
                return res.sendSuccess({key:'data', value:result});
            }catch (e) {
                throw new sendError('Error editing movie: ' + e.errors[0].message, 400, e.errors[0].value);
            }

    }
    async deleteMovie(req, res){
        try{
            const id = req.params.id;
            const result =await selectMovieWithActors({'id':id});
            await result.destroy();
            res.sendSuccess( result);
        }catch (e){
            throw new sendError('Error deleting movie: ' + e.errors[0].message, 400, e.errors[0].value);
        }
    }
    async getAllMovies(req, res){
            const {
                actor,
                title,
                search,
                sort = 'id',
                order = 'ASC',
                limit = 20,
                offset = 0
            } = req.query;

            // options
            let where = {};
            let actorWhere = {};

            if (search) {
                if(await Movie.findOne({where:{title:{ [Op.like]: `%${search}%` }}})){
                    where = {title:{ [Op.like]: `%${search}%` }};
                }else{
                    actorWhere = {name:{ [Op.like]: `%${search}%` }};
                }
            }
            if (title) {
                where = {title:{ [Op.like]: `%${title}%` }};
            }
            if (actor) {
                actorWhere = {name:{ [Op.like]: `%${actor}%` }};
            }
            try{
            // runs query with filters and include
            let result = await Movie.findAll({
                where,
                include: {
                    model: Actor,
                    where: actorWhere,
                    through: { attributes: [] }
                },
                order: [[sort, order]],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
                // the default sqlite sort doesn't work correctly with Ukrainian letters
                // or uppercase/lowercase so the result resorted with Intl.Collator
            if(sort!=='id'){
                const collator = new Intl.Collator('uk', {
                    sensitivity: 'base',  // treats uppercase/lowercase as equal
                    usage: 'sort'
                });
                const direction = order === 'DESC' ? -1 : 1;

                result = result.sort((a, b) => {
                    return direction * collator.compare(a[sort], b[sort]);
                });
            }
            return res.sendSuccess( {key:'data', value:result});
        } catch (e) {
            throw new sendError('Error getting movie list: ' + e.errors[0].message, 400, e.errors[0].value);
        }
    }

}

module.exports = new MoviesController();