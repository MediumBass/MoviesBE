const fs = require("node:fs");
const Movie = require("../database/models/movie");
const Actor = require("../database/models/actor");


async function selectMovieWithActors(obj) {
    let movie
    try{
     movie = await Movie.findOne({
        where: obj,
        include: {
            model: Actor,
            as: 'actors',
            through: {attributes: []}, // hide join table
        },
    })

    }catch (e){
        throw e
    }
    return movie;
}

async function createMovie(body) {
    try{
        const { title, year, format, actors } = body;
        const movie = await Movie.create({ title, year, format });


        for (const actorName of actors) {
            let actor = await Actor.findOne({ where: { name: actorName } });
            if (!actor) {
                actor = await Actor.create({ name: actorName });
            }
            await movie.addActor(actor); //method created by sequelize
        }
    }catch (e) {
        throw e
    }

}

function txtToJSON(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, 'utf-8', (err, text) => {
            if (err) return reject(new Error('Failed to read uploaded file'));

            fs.unlinkSync(file.path); // delete a temp file
            // this function split txt file to blocks by empty line, then each line converts to JSON
            const entries = text.trim().split(/\n\s*\n/);
            const movies = entries.map((block, index) => {
                const lines = block.split('\n');
                const titleLine = lines.find(line => line.startsWith('Title:'));
                const yearLine = lines.find(line => line.startsWith('Release Year:'));
                const formatLine = lines.find(line => line.startsWith('Format:'));
                const actorsLine = lines.find(line => line.startsWith('Stars:'));

                return {
                    id: index + 1,
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
        if (req.file.mimetype !== 'text/plain') {
            fs.unlinkSync(req.file.path);
            return res.status(400).send('Only .txt files are allowed.');
        }
        try {
            const result = await txtToJSON(req.file);
            await Promise.all(result.map(createMovie));
            return res.sendSuccess({key:"data", value:result});
        } catch (e) {
            res.status(500).send('error'+e.message)
        }
    }
    async getOneMovie(req, res) {
        const id = req.params.id;
        const result = await selectMovieWithActors({"id":id});
        return res.sendSuccess({key:"data", value:result});
    }
    async createNewMovie(req, res) {
        try {
            await createMovie(req.body)
            const result = await selectMovieWithActors({"title":req.body.title});
            return res.sendSuccess({key:"data", value:result});;
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Internal server error '+e.message });
        }
    };
    async updateMovie(req, res){
        try{
            const id = req.params.id;
            const { title, year, format, actors } = req.body;
            const movie =await Movie.findByPk(id, {
                include: { model: Actor, as: 'actors' }
            });
            if(!movie){
                return res.status(404).json({error: 'Movie not found '})
            }
            await movie.update(
                { title, year, format, actors },
                {
                    where: {
                        id: id,
                    },
                },
            );
            const actorInstances = [];
            for (const name of actors) {
                const [actor] = await Actor.findOrCreate({ where: { name } });
                actorInstances.push(actor);
            }

            await movie.setActors(actorInstances);
            const result = await selectMovieWithActors({"id":id});
            return res.sendSuccess({key:"data", value:result});
        }catch (e){
            res.status(500).json({ error: 'Internal server error ' +e.message });
        }
    }
    async deleteMovie(req, res){
        try{
            const id = req.params.id;
            const movie =await Movie.findByPk(id);
            if(!movie){
                return res.status(404).json({error: 'Movie not found '})
            }
            await movie.destroy();
            const result = await selectMovieWithActors({"id":id});

            res.sendSuccess(result)
        }catch (e){
            console.log(e)
            res.status(500).json({ error: 'Internal server error ' +e.message });
        }
    }
    async getAllMovies(req, res){
        try {
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
            const actorWhere = {};

            if (search) {
                if(await selectMovieWithActors({"title":search})){
                    where.title = search
                } else{
                    actorWhere.name = search;
                }
            }

            if (title) {
                where.title = title;
            }

            if (actor) {
                actorWhere.name = actor;
            }

            // runs query with filters and include
            const result = await Movie.findAll({
                where,
                include: {
                    model: Actor,
                    as: 'actors',
                    where: Object.keys(actorWhere).length ? actorWhere : undefined,
                    through: { attributes: [] }
                },
                order: [[sort, order]],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.sendSuccess({key:"data", value:result});
        } catch (e) {
            console.error('Search error:', e);
            res.status(500).json({ error: 'Internal server error ' +e.message });
        }
    }

}

module.exports = new MoviesController()